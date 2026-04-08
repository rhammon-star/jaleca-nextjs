<?php
/**
 * Jaleca — Hooks WordPress para notificações automáticas
 * Adicionar ao final do functions.php do tema ativo
 * OU criar como plugin em: wp-content/plugins/jaleca-hooks/jaleca-hooks.php
 *
 * IMPORTANTE: substituir JALECA_WEBHOOK_SECRET pelo valor real da variável
 * de ambiente JALECA_WEBHOOK_SECRET configurada na Vercel.
 */

define('JALECA_NEXT_URL', 'https://jaleca.com.br');
define('JALECA_SECRET',   'SUBSTITUIR_PELO_VALOR_DE_JALECA_WEBHOOK_SECRET_NA_VERCEL');

// ─────────────────────────────────────────────────────────────────────────────
// 1. Email automático quando status do pedido muda
// ─────────────────────────────────────────────────────────────────────────────
add_action('woocommerce_order_status_changed', function($order_id, $old_status, $new_status, $order) {
    $statuses_to_notify = ['on-hold', 'faturado', 'em-separacao', 'cancelled', 'refunded', 'completed'];
    if (!in_array($new_status, $statuses_to_notify)) return;

    wp_remote_post(JALECA_NEXT_URL . '/api/orders/notify', [
        'headers'  => ['Content-Type' => 'application/json'],
        'body'     => wp_json_encode([
            'secret'        => JALECA_SECRET,
            'orderId'       => $order_id,
            'newStatus'     => $new_status,
            'customerEmail' => $order->get_billing_email(),
            'customerName'  => trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()),
            'orderTotal'    => 'R$ ' . number_format((float) $order->get_total(), 2, ',', '.'),
        ]),
        'timeout'  => 15,
        'blocking' => false,
    ]);
}, 10, 4);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Email automático quando uma observação é adicionada ao pedido
// ─────────────────────────────────────────────────────────────────────────────
add_action('woocommerce_order_note_added', function($note_id, $order_id) {
    $note = wc_get_order_note($note_id);
    if (!$note) return;

    // Ignora notas do sistema (status changes automáticas)
    if ($note->added_by === 'system') return;

    $order = wc_get_order($order_id);
    if (!$order) return;

    $customer_email = $order->get_billing_email();
    if (empty($customer_email)) return;

    wp_remote_post(JALECA_NEXT_URL . '/api/orders/note', [
        'headers'  => ['Content-Type' => 'application/json'],
        'body'     => wp_json_encode([
            'secret'        => JALECA_SECRET,
            'orderId'       => $order_id,
            'note'          => $note->content,
            'customerEmail' => $customer_email,
            'customerName'  => trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()),
        ]),
        'timeout'  => 15,
        'blocking' => false,
    ]);
}, 10, 2);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Email automático quando etiqueta Melhor Envio é gerada
// ─────────────────────────────────────────────────────────────────────────────
add_action('updated_post_meta', function($meta_id, $object_id, $meta_key, $meta_value) {
    // Detecta quando ME salva o tag da etiqueta
    $me_keys = ['_melhorenvio_tag', 'melhorenvio_tag', '_me_tag'];
    if (!in_array($meta_key, $me_keys)) return;
    if (empty($meta_value)) return;

    $order = wc_get_order($object_id);
    if (!$order) return;

    $customer_email = $order->get_billing_email();
    if (empty($customer_email)) return;

    // Evita enviar duas vezes se já foi notificado
    $already_notified = get_post_meta($object_id, '_jaleca_tracking_notified', true);
    if ($already_notified === $meta_value) return;
    update_post_meta($object_id, '_jaleca_tracking_notified', $meta_value);

    // Busca código de rastreio real (pode ser diferente do me_tag)
    $tracking_code = get_post_meta($object_id, '_melhorenvio_tracking', true) ?: $meta_value;
    $carrier       = get_post_meta($object_id, '_melhorenvio_carrier', true) ?: 'Melhor Envio';

    wp_remote_post(JALECA_NEXT_URL . '/api/tracking/register', [
        'headers'  => ['Content-Type' => 'application/json'],
        'body'     => wp_json_encode([
            'secret'        => JALECA_SECRET,
            'orderId'       => $object_id,
            'trackingCode'  => $tracking_code,
            'carrier'       => $carrier,
            'meTag'         => $meta_value,
            'customerEmail' => $customer_email,
            'customerName'  => trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()),
        ]),
        'timeout'  => 15,
        'blocking' => false,
    ]);
}, 10, 4);
