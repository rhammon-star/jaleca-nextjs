<?php
/**
 * Jaleca — Integração Next.js + Melhor Envio
 * Adicionar no fim do functions.php do tema filho.
 *
 * CONFIGURAR:
 *   JALECA_NEXTJS_URL      → URL do site Next.js
 *   JALECA_WEBHOOK_SECRET  → mesmo valor do JALECA_WEBHOOK_SECRET no Vercel
 */

define( 'JALECA_NEXTJS_URL',     'https://jaleca.com.br' );
define( 'JALECA_WEBHOOK_SECRET', 'jaleca-webhook-secret-2026' );

// ──────────────────────────────────────────────────────────────────────────────
// 1. REGISTRAR STATUS CUSTOMIZADOS
// (os que já existem no WooCommerce não precisam ser registrados de novo)
// ──────────────────────────────────────────────────────────────────────────────

add_action( 'init', function () {

    $custom_statuses = [
        'wc-novo-pedido'      => 'Novo pedido',
        'wc-pagamento-analise'=> 'Pagamento em análise',
        'wc-faturado'         => 'Faturado',
        'wc-em-separacao'     => 'Em separação',
        'wc-enviado'          => 'Enviado para transportadora',
        'wc-saiu-entrega'     => 'Saiu para entrega',
        'wc-retirar-loja'     => 'Disponível para retirar na loja',
    ];

    foreach ( $custom_statuses as $slug => $label ) {
        if ( ! array_key_exists( $slug, (array) get_post_statuses() ) ) {
            register_post_status( $slug, [
                'label'                     => $label,
                'public'                    => true,
                'exclude_from_search'       => false,
                'show_in_admin_all_list'    => true,
                'show_in_admin_status_list' => true,
                'label_count'               => _n_noop( "$label <span class=\"count\">(%s)</span>", "$label <span class=\"count\">(%s)</span>" ),
            ] );
        }
    }
} );

// Adiciona os status customizados ao seletor do WooCommerce
add_filter( 'wc_order_statuses', function ( $statuses ) {
    // Insere os customizados após "processing"
    $new = [];
    foreach ( $statuses as $key => $label ) {
        $new[ $key ] = $label;
        if ( $key === 'wc-processing' ) {
            $new['wc-pagamento-analise'] = 'Pagamento em análise';
            $new['wc-faturado']          = 'Faturado';
            $new['wc-em-separacao']      = 'Em separação';
            $new['wc-enviado']           = 'Enviado para transportadora';
            $new['wc-saiu-entrega']      = 'Saiu para entrega';
            $new['wc-retirar-loja']      = 'Disponível para retirar na loja';
        }
    }
    return $new;
} );

// ──────────────────────────────────────────────────────────────────────────────
// 2. HOOK: MUDANÇA DE STATUS → EMAIL AUTOMÁTICO (Next.js)
// ──────────────────────────────────────────────────────────────────────────────

// Status que disparam email no Next.js
$JALECA_STATUS_EMAIL = [
    'on-hold',            // Pagamento em análise (padrão WC)
    'wc-pagamento-analise', // Pagamento em análise (custom)
    'wc-faturado',        // Faturado
    'faturado',
    'wc-em-separacao',    // Em separação
    'em-separacao',
    'cancelled',          // Cancelado (padrão WC)
    'wc-cancelado',
    'refunded',           // Reembolsado (padrão WC)
    'wc-reembolsado',
];

add_action( 'woocommerce_order_status_changed', function ( $order_id, $old_status, $new_status ) use ( $JALECA_STATUS_EMAIL ) {

    $slug_full = 'wc-' . $new_status;
    if ( ! in_array( $new_status, $JALECA_STATUS_EMAIL ) && ! in_array( $slug_full, $JALECA_STATUS_EMAIL ) ) {
        return;
    }

    $order = wc_get_order( $order_id );
    if ( ! $order ) return;

    $payload = [
        'secret'        => JALECA_WEBHOOK_SECRET,
        'orderId'       => $order_id,
        'newStatus'     => $new_status,
        'customerEmail' => $order->get_billing_email(),
        'customerName'  => trim( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() ),
        'orderTotal'    => 'R$ ' . number_format( (float) $order->get_total(), 2, ',', '.' ),
    ];

    wp_remote_post( JALECA_NEXTJS_URL . '/api/orders/notify', [
        'body'     => wp_json_encode( $payload ),
        'headers'  => [ 'Content-Type' => 'application/json' ],
        'timeout'  => 10,
        'blocking' => false, // não trava o admin
    ] );

}, 10, 3 );

// ──────────────────────────────────────────────────────────────────────────────
// 3. HOOK: ETIQUETA MELHOR ENVIO SALVA → RASTREIO AUTOMÁTICO + EMAIL #5
// O plugin ME salva '_melhorenvio_tracking' ao gerar/imprimir etiqueta
// ──────────────────────────────────────────────────────────────────────────────

function jaleca_notify_tracking( $post_id, $meta_value ) {
    $order = wc_get_order( $post_id );
    if ( ! $order ) return;

    // Evita disparo duplicado
    $already = get_post_meta( $post_id, 'jaleca_tracking_active', true );
    if ( $already === '1' ) return;

    // Tenta pegar nome da transportadora de vários campos possíveis do ME
    $carrier = get_post_meta( $post_id, '_melhorenvio_carrier_name', true )
            ?: get_post_meta( $post_id, '_melhorenvio_company', true )
            ?: get_post_meta( $post_id, '_melhorenvio_service', true )
            ?: 'Transportadora';

    $me_tag = get_post_meta( $post_id, '_melhorenvio_tag', true ) ?: '';

    $payload = [
        'secret'        => JALECA_WEBHOOK_SECRET,
        'orderId'       => $post_id,
        'trackingCode'  => $meta_value,
        'carrier'       => $carrier,
        'meTag'         => $me_tag,
        'customerEmail' => $order->get_billing_email(),
        'customerName'  => trim( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() ),
    ];

    wp_remote_post( JALECA_NEXTJS_URL . '/api/tracking/register', [
        'body'     => wp_json_encode( $payload ),
        'headers'  => [ 'Content-Type' => 'application/json' ],
        'timeout'  => 10,
        'blocking' => false,
    ] );
}

// Cobre inserção (primeira vez)
add_action( 'added_post_meta', function ( $meta_id, $post_id, $meta_key, $meta_value ) {
    if ( $meta_key === '_melhorenvio_tracking' && ! empty( $meta_value ) ) {
        jaleca_notify_tracking( $post_id, $meta_value );
    }
}, 10, 4 );

// Cobre atualização (código corrigido depois)
add_action( 'updated_post_meta', function ( $meta_id, $post_id, $meta_key, $meta_value ) {
    if ( $meta_key === '_melhorenvio_tracking' && ! empty( $meta_value ) ) {
        jaleca_notify_tracking( $post_id, $meta_value );
    }
}, 10, 4 );
