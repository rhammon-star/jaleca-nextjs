<?php
/**
 * Jaleca — Endpoints de token para reset de senha
 * Adicionar ao plugin Jaleca Fix (jaleca-fix.php) dentro do add_action('rest_api_init', ...)
 * OU colar no fim do functions.php do tema ativo.
 *
 * ATENÇÃO: o secret deve ser o mesmo que JALECA_PLUGIN_SECRET no Vercel.
 */

add_action('rest_api_init', function () {

    $secret = defined('JALECA_PLUGIN_SECRET') ? JALECA_PLUGIN_SECRET : 'jaleca-register-secret-2026';

    // ── POST /wp-json/jaleca/v1/save-token ──────────────────────────────────
    // Salva token de reset de senha no user_meta do WordPress
    register_rest_route('jaleca/v1', '/save-token', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) use ($secret) {
            if ($request->get_param('secret') !== $secret) {
                return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
            }

            $customer_id = intval($request->get_param('customer_id'));
            $token       = sanitize_text_field($request->get_param('token'));
            $expires     = sanitize_text_field($request->get_param('expires'));

            if (!$customer_id || !$token || !$expires) {
                return new WP_Error('invalid_params', 'Missing customer_id, token or expires', ['status' => 400]);
            }

            if (!get_user_by('id', $customer_id)) {
                return new WP_Error('not_found', 'Customer not found', ['status' => 404]);
            }

            update_user_meta($customer_id, 'email_verify_token',   $token);
            update_user_meta($customer_id, 'email_verify_expires', $expires);

            return rest_ensure_response([
                'success'     => true,
                'customer_id' => $customer_id,
            ]);
        },
    ]);

    // ── POST /wp-json/jaleca/v1/get-token ───────────────────────────────────
    // Lê token de reset de senha do user_meta do WordPress
    register_rest_route('jaleca/v1', '/get-token', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) use ($secret) {
            if ($request->get_param('secret') !== $secret) {
                return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
            }

            $customer_id = intval($request->get_param('customer_id'));

            if (!$customer_id) {
                return new WP_Error('invalid_params', 'Missing customer_id', ['status' => 400]);
            }

            $user = get_user_by('id', $customer_id);
            if (!$user) {
                return new WP_Error('not_found', 'Customer not found', ['status' => 404]);
            }

            $token   = get_user_meta($customer_id, 'email_verify_token',   true);
            $expires = get_user_meta($customer_id, 'email_verify_expires', true);

            return rest_ensure_response([
                'customer_id'          => $customer_id,
                'email'                => $user->user_email,
                'email_verify_token'   => $token   ?: '',
                'email_verify_expires' => $expires ?: '',
            ]);
        },
    ]);

    // ── POST /wp-json/jaleca/v1/change-password ──────────────────────────────
    // Atualiza a senha do user WordPress (para customers criados via endpoint WP)
    register_rest_route('jaleca/v1', '/change-password', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) use ($secret) {
            if ($request->get_param('secret') !== $secret) {
                return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
            }

            $customer_id = intval($request->get_param('customer_id'));
            $password    = $request->get_param('password');

            if (!$customer_id || !$password) {
                return new WP_Error('invalid_params', 'Missing customer_id or password', ['status' => 400]);
            }

            if (!get_user_by('id', $customer_id)) {
                return new WP_Error('not_found', 'Customer not found', ['status' => 404]);
            }

            wp_set_password($password, $customer_id);

            return rest_ensure_response(['success' => true]);
        },
    ]);

    // ── POST /wp-json/jaleca/v1/clear-token ─────────────────────────────────
    // Limpa token após uso (reset de senha confirmado)
    register_rest_route('jaleca/v1', '/clear-token', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) use ($secret) {
            if ($request->get_param('secret') !== $secret) {
                return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
            }

            $customer_id = intval($request->get_param('customer_id'));
            if (!$customer_id) {
                return new WP_Error('invalid_params', 'Missing customer_id', ['status' => 400]);
            }

            delete_user_meta($customer_id, 'email_verify_token');
            delete_user_meta($customer_id, 'email_verify_expires');
            update_user_meta($customer_id, 'email_verified', '1');

            return rest_ensure_response(['success' => true]);
        },
    ]);

});
