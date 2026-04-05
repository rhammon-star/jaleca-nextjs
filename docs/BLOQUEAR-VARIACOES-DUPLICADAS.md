# Como Bloquear Variações Duplicadas no WooCommerce

## Problema
Variações duplicadas (ex: "Branco - P" aparece 2x) causam problemas de preço e confusão.

---

## Opção 1: Script de Verificação (Agora)

Rode este comando para encontrar todos os produtos com variações duplicadas:

```bash
cd /Users/rhammon/SiteJaleca/jaleca-nextjs

export WC_KEY=sua_consumer_key
export WC_SECRET=sua_consumer_secret
export WC_URL=https://wp.jaleca.com.br

node scripts/check-duplicate-variations.js
```

**Você precisa das chaves do WooCommerce REST API:**
1. WooCommerce → Configurações → Avançado → API REST
2. Crie uma chave com Permissão de **Leitura/Escrita**

---

## Opção 2: Bloquear Futuras Duplicatas (WordPress/Hostinger)

Adicione este código no **functions.php** do seu tema WordPress:

```php
/**
 * Bloquear criação de variações duplicadas no WooCommerce
 * Adicione este código no functions.php do seu tema
 */

// Verificar antes de criar/atualizar variação
add_action('woocommerce_save_product_variation', 'bloquear_variacao_duplicada', 10, 2);

function bloquear_variacao_duplicada($variation_id, $i) {
    $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

    if (!$product_id) return;

    // Pega os atributos da variação sendo salva
    $new_attrs = [];
    if (isset($_POST['variable_post_id'][$i])) {
        $attr_name = isset($_POST['attribute_pa_cor'][$i]) ? 'cor' : (isset($_POST['attribute_pa_tamanho'][$i]) ? 'tamanho' : '');
        $attr_value = isset($_POST['attribute_pa_cor'][$i]) ? $_POST['attribute_pa_cor'][$i] : (isset($_POST['attribute_pa_tamanho'][$i]) ? $_POST['attribute_pa_tamanho'][$i] : '');

        if ($attr_name && $attr_value) {
            $new_attrs[$attr_name] = sanitize_title($attr_value);
        }
    }

    // Se não tem atributos, não verifica
    if (empty($new_attrs)) return;

    // Pega todas as variações existentes deste produto
    $variations = get_posts([
        'post_parent' => $product_id,
        'post_type' => 'product_variation',
        'post_status' => ['publish', 'draft', 'pending', 'private'],
        'numberposts' => -1,
        'fields' => 'ids'
    ]);

    foreach ($variations as $var_id) {
        // Pula a variação que está sendo salva
        if ($var_id == $variation_id) continue;

        // Pega os atributos desta variação
        $existing = get_post_meta($var_id, 'attributes', true);

        // Compara
        $is_duplicate = true;
        foreach ($new_attrs as $name => $value) {
            if (!isset($existing[$name]) || $existing[$name] !== $value) {
                $is_duplicate = false;
                break;
            }
        }

        if ($is_duplicate) {
            // É duplicata! Remove a nova variação e mostra erro
            wp_delete_post($variation_id, true);

            wc_add_notice(
                '⚠️ Esta combinação de atributos já existe neste produto. Por favor, use uma combinação diferente.',
                'error'
            );
            break;
        }
    }
}
```

---

## Opção 3: Plugin para Gerenciar Variações

Instale um destes plugins no WooCommerce (Hostinger):

1. **"WooCommerce Advanced Product Variables"** (gratuito)
   - Permite ver e gerenciar todas as variações em uma tabela
   - Encontra duplicadas facilmente

2. **"Better Product Import/Export for WooCommerce"**
   - Verifica duplicatas na importação

3. **"WooCommerce Duplicate Variations"**
   - Remove duplicadas em massa

---

## Como Remover Variações Duplicadas Manualmente

1. Vá em **WooCommerce → Produtos**
2. Edite o produto com problema
3. Vá na aba **Variações**
4. Use "Procurar Variações" para carregar todas
5. Identifique as duplicadas (mesma cor + mesmo tamanho)
6. Clique em **"X"** para deletar a duplicada

**Dica:** Mantenha a variação que tem:
- Preço correto definido
- Imagens corretas
- Estoque correto

---

## Prevenir Futuras Duplicatas

1. **Antes de criar variação**, verifique se a combinação cor+tamanho já existe
2. **Use importações em massa com cuidado** — sempre revise depois
3. **Não use "Criar variações para todos os atributos"** sem verificar antes

---

## Resultado Esperado

Depois de remover as duplicadas:
- ✅ Preços corretos em cada variação
- ✅ Sem confusão de estoque
- ✅ Site mais rápido (menos dados)
