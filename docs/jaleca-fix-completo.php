<?php
/**
 * Plugin Name: Jaleca Fix - Create Users
 * Description: Endpoint customizado para criacao de clientes e reset de senha
 * Version: 2.4
 */

// Chave secreta — deve ser igual a variavel JALECA_REGISTER_SECRET no Vercel
define('JALECA_REGISTER_SECRET', 'jaleca-register-secret-2026');

// ── Suprimir emails padrão do WordPress ao criar novo usuário ────────────────
// O Jaleca Next.js envia seus próprios emails via Brevo com layout correto.
// Nota: jaleca-api.php também aplica esses filtros — duplicata é inofensiva.
add_filter('wp_new_user_notification_email',       '__return_empty_array');
add_filter('wp_new_user_notification_email_admin', '__return_empty_array');

// ── Suprimir email "Sua senha foi alterada" do WordPress ──────────────────────
// WP dispara wp_password_change_notification() ao chamar wp_set_password().
// Esse email usa username interno e email do admin WP — feio e incorreto.
// O Jaleca envia o próprio email bonito via Brevo.
add_filter('send_password_change_email', '__return_false');

add_action('rest_api_init', function() {
    register_rest_route('jaleca/v1', '/create-customer', array(
        'methods'             => 'POST',
        'callback'            => 'jaleca_create_customer',
        'permission_callback' => '__return_true',
    ));
});

function jaleca_create_customer(WP_REST_Request $request) {
    $secret = $request->get_header('X-Jaleca-Secret');
    if ($secret !== JALECA_REGISTER_SECRET) {
        return new WP_Error('forbidden', 'Acesso nao autorizado', array('status' => 403));
    }

    $email     = sanitize_email($request->get_param('email'));
    $password  = $request->get_param('password');
    $firstName = sanitize_text_field($request->get_param('first_name'));
    $lastName  = sanitize_text_field($request->get_param('last_name'));
    $cpf       = sanitize_text_field($request->get_param('cpf'));
    $phone     = sanitize_text_field($request->get_param('phone'));

    if (!$email || !$password) {
        return new WP_Error('missing', 'Email e senha sao obrigatorios', array('status' => 400));
    }

    if (email_exists($email)) {
        return new WP_Error('email_exists', 'Este email ja esta cadastrado', array('status' => 409));
    }

    $username = sanitize_user(explode('@', $email)[0] . '_' . wp_generate_password(4, false));
    $userId   = wp_create_user($username, $password, $email);

    if (is_wp_error($userId)) {
        return new WP_Error('create_failed', $userId->get_error_message(), array('status' => 500));
    }

    $user = new WP_User($userId);
    $user->set_role('customer');

    wp_update_user(array(
        'ID'           => $userId,
        'first_name'   => $firstName,
        'last_name'    => $lastName,
        'display_name' => trim($firstName . ' ' . $lastName),
    ));

    if ($cpf)   update_user_meta($userId, 'billing_cpf', $cpf);
    if ($phone) update_user_meta($userId, 'billing_phone', $phone);
    update_user_meta($userId, 'billing_first_name', $firstName);
    update_user_meta($userId, 'billing_last_name', $lastName);
    update_user_meta($userId, 'billing_email', $email);

    return rest_ensure_response(array(
        'id'    => $userId,
        'email' => $email,
        'name'  => trim($firstName . ' ' . $lastName),
    ));
}

// Token endpoints para reset de senha

add_action('rest_api_init', 'jaleca_register_token_routes');

function jaleca_register_token_routes() {
    register_rest_route('jaleca/v1', '/save-token', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'jaleca_save_token',
    ));
    register_rest_route('jaleca/v1', '/get-token', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'jaleca_get_token',
    ));
    register_rest_route('jaleca/v1', '/change-password', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'jaleca_change_password',
    ));
    register_rest_route('jaleca/v1', '/clear-token', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'jaleca_clear_token',
    ));
}

function jaleca_verify_secret(WP_REST_Request $request) {
    $secret = defined('JALECA_REGISTER_SECRET') ? JALECA_REGISTER_SECRET : 'jaleca-register-secret-2026';
    return $request->get_param('secret') === $secret;
}

function jaleca_save_token(WP_REST_Request $request) {
    if (!jaleca_verify_secret($request)) {
        return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
    }
    $customer_id = intval($request->get_param('customer_id'));
    $token       = sanitize_text_field($request->get_param('token'));
    $expires     = sanitize_text_field($request->get_param('expires'));
    if (!$customer_id || !$token || !$expires) {
        return new WP_Error('invalid_params', 'Missing params', array('status' => 400));
    }
    if (!get_user_by('id', $customer_id)) {
        return new WP_Error('not_found', 'Customer not found', array('status' => 404));
    }
    update_user_meta($customer_id, 'email_verify_token', $token);
    update_user_meta($customer_id, 'email_verify_expires', $expires);
    return rest_ensure_response(array('success' => true, 'customer_id' => $customer_id));
}

function jaleca_get_token(WP_REST_Request $request) {
    if (!jaleca_verify_secret($request)) {
        return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
    }
    $customer_id = intval($request->get_param('customer_id'));
    if (!$customer_id) {
        return new WP_Error('invalid_params', 'Missing customer_id', array('status' => 400));
    }
    $user = get_user_by('id', $customer_id);
    if (!$user) {
        return new WP_Error('not_found', 'Customer not found', array('status' => 404));
    }
    $token_val   = get_user_meta($customer_id, 'email_verify_token', true);
    $expires_val = get_user_meta($customer_id, 'email_verify_expires', true);
    if (!$token_val)   { $token_val = ''; }
    if (!$expires_val) { $expires_val = ''; }
    return rest_ensure_response(array(
        'customer_id'          => $customer_id,
        'email'                => $user->user_email,
        'email_verify_token'   => $token_val,
        'email_verify_expires' => $expires_val,
    ));
}

function jaleca_change_password(WP_REST_Request $request) {
    if (!jaleca_verify_secret($request)) {
        return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
    }
    $customer_id = intval($request->get_param('customer_id'));
    $password    = $request->get_param('password');
    if (!$customer_id || !$password) {
        return new WP_Error('invalid_params', 'Missing params', array('status' => 400));
    }
    if (!get_user_by('id', $customer_id)) {
        return new WP_Error('not_found', 'Customer not found', array('status' => 404));
    }
    wp_set_password($password, $customer_id);
    return rest_ensure_response(array('success' => true));
}

function jaleca_clear_token(WP_REST_Request $request) {
    if (!jaleca_verify_secret($request)) {
        return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
    }
    $customer_id = intval($request->get_param('customer_id'));
    if (!$customer_id) {
        return new WP_Error('invalid_params', 'Missing customer_id', array('status' => 400));
    }
    delete_user_meta($customer_id, 'email_verify_token');
    delete_user_meta($customer_id, 'email_verify_expires');
    update_user_meta($customer_id, 'email_verified', '1');
    return rest_ensure_response(array('success' => true));
}

// Busca cliente por CPF no user_meta (para clientes criados via endpoint WP)
add_action('rest_api_init', 'jaleca_register_lookup_route');

function jaleca_register_lookup_route() {
    register_rest_route('jaleca/v1', '/lookup-cpf', array(
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'jaleca_lookup_cpf',
    ));
}

function jaleca_lookup_cpf(WP_REST_Request $request) {
    $secret = defined('JALECA_REGISTER_SECRET') ? JALECA_REGISTER_SECRET : 'jaleca-register-secret-2026';
    if ($request->get_param('secret') !== $secret) {
        return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
    }

    $cpf = preg_replace('/[^0-9]/', '', $request->get_param('cpf'));
    if (!$cpf || strlen($cpf) !== 11) {
        return new WP_Error('invalid_params', 'CPF invalido', array('status' => 400));
    }

    $users = get_users(array(
        'meta_key'   => 'billing_cpf',
        'meta_value' => $cpf,
        'number'     => 1,
        'fields'     => array('ID', 'user_email'),
    ));

    if (!empty($users)) {
        return rest_ensure_response(array(
            'found' => true,
            'id'    => intval($users[0]->ID),
            'email' => $users[0]->user_email,
        ));
    }

    return rest_ensure_response(array('found' => false));
}

// ── Auto-preenche EAN-13 na variação ao salvar (se campo GTIN vazio) ──────────
add_action('woocommerce_save_product_variation', 'jaleca_auto_ean13', 10, 2);

function jaleca_calc_ean13($base12) {
    $sum = 0;
    for ($i = 0; $i < 12; $i++) {
        $d    = intval($base12[$i]);
        $sum += ($i % 2 === 0) ? $d : $d * 3;
    }
    $check = (10 - ($sum % 10)) % 10;
    return $base12 . $check;
}

function jaleca_gerar_ean($sku) {
    $numeric = preg_replace('/\D/', '', $sku);
    $numeric = str_pad(substr($numeric, -9), 9, '0', STR_PAD_LEFT);
    $base12  = '789' . $numeric;
    return jaleca_calc_ean13($base12);
}

function jaleca_auto_ean13($variation_id, $i) {
    $existing = get_post_meta($variation_id, '_global_unique_id', true);
    if (!empty($existing)) return; // ja tem EAN, nao sobrescreve

    $sku = get_post_meta($variation_id, '_sku', true);
    if (empty($sku)) $sku = strval($variation_id);

    $ean = jaleca_gerar_ean($sku);
    update_post_meta($variation_id, '_global_unique_id', $ean);
}

// Desativa automaticamente variacoes sem preco ao salvar no WC Admin
add_action('woocommerce_save_product_variation', 'jaleca_desativa_variacao_sem_preco', 20, 2);

function jaleca_desativa_variacao_sem_preco($variation_id, $i) {
    $preco_regular = get_post_meta($variation_id, '_regular_price', true);
    $preco_venda   = get_post_meta($variation_id, '_sale_price', true);

    if (empty($preco_regular) && empty($preco_venda)) {
        remove_action('woocommerce_save_product_variation', 'jaleca_desativa_variacao_sem_preco', 20);

        wp_update_post(array(
            'ID'          => $variation_id,
            'post_status' => 'private',
        ));

        add_action('woocommerce_save_product_variation', 'jaleca_desativa_variacao_sem_preco', 20, 2);
    }
}

// ── Endpoint: GET /jaleca/v1/variation/{id} — usado pelo Next sync ────────────
add_action('rest_api_init', 'jaleca_register_variation_route');

function jaleca_register_variation_route() {
    register_rest_route('jaleca/v1', '/variation/(?P<id>\d+)', array(
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'jaleca_get_variation',
    ));
}

function jaleca_get_variation(WP_REST_Request $request) {
    $secret_expected = defined('JALECA_REGISTER_SECRET') ? JALECA_REGISTER_SECRET : 'jaleca-register-secret-2026';
    if ($request->get_header('X-Jaleca-Secret') !== $secret_expected) {
        return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
    }

    $id = absint($request['id']);
    if (!$id) return new WP_Error('invalid', 'ID invalido', array('status' => 400));

    if (!function_exists('wc_get_product')) {
        return new WP_Error('wc_missing', 'WooCommerce nao disponivel', array('status' => 500));
    }

    $variation = wc_get_product($id);
    if (!$variation || $variation->get_type() !== 'variation') {
        return new WP_Error('not_found', 'Variation not found', array('status' => 404));
    }

    $attrs = array();
    foreach ($variation->get_attributes() as $name => $option) {
        $attrs[] = array(
            'name'   => wc_attribute_label($name),
            'option' => $option,
        );
    }

    $modified = $variation->get_date_modified();
    return rest_ensure_response(array(
        'id'                => $variation->get_id(),
        'parent_id'         => $variation->get_parent_id(),
        'status'            => $variation->get_status(),
        'stock_status'      => $variation->get_stock_status(),
        'price'             => (string) $variation->get_price(),
        'sku'               => (string) $variation->get_sku(),
        'date_modified_gmt' => $modified ? $modified->date('c') : gmdate('c'),
        'attributes'        => $attrs,
    ));
}
