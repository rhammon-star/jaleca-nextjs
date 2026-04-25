import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_WOOCOMMERCE_GRAPHQL_URL || 'https://wp.jaleca.com.br/graphql';
const client = new GraphQLClient(endpoint);

const GET_ALL_PRODUCTS = `
  query GetAllProducts($first: Int, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        productCategories {
          nodes {
            name
            slug
          }
        }
        ... on SimpleProduct {
          attributes {
            nodes {
              name
              options
            }
          }
        }
        ... on VariableProduct {
          attributes {
            nodes {
              name
              options
            }
          }
          variations(first: 100) {
            nodes {
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchAllProducts() {
  const allProducts = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const data = await client.request(GET_ALL_PRODUCTS, {
      first: 100,
      after,
    });

    allProducts.push(...data.products.nodes);
    hasNextPage = data.products.pageInfo.hasNextPage;
    after = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

async function extractAllColors() {
  const products = await fetchAllProducts();
  const colorsByCategory = {
    'Jalecos': new Set(),
    'Conjuntos': new Set(),
    'Dólmãs': new Set(),
    'Acessórios': new Set(),
    'Outros': new Set()
  };
  const allCategories = new Set();

  console.log(`📦 Total de produtos: ${products.length}\n`);

  products.forEach((product) => {
    // Collect all categories for debugging
    if (product.productCategories?.nodes) {
      product.productCategories.nodes.forEach(c => {
        allCategories.add(`${c.name} (${c.slug})`);
      });
    }

    // Get product category
    let category = 'Outros';
    if (product.productCategories?.nodes) {
      const categoryNames = product.productCategories.nodes.map(c => c.name.toLowerCase());
      const categorySlugs = product.productCategories.nodes.map(c => c.slug.toLowerCase());

      if (categoryNames.some(n => n.includes('jaleco')) || categorySlugs.some(s => s.includes('jaleco'))) {
        category = 'Jalecos';
      } else if (categoryNames.some(n => n.includes('conjunto')) || categorySlugs.some(s => s.includes('conjunto'))) {
        category = 'Conjuntos';
      } else if (categoryNames.some(n => n.includes('dólmã') || n.includes('dolma') || n.includes('dômã') || n.includes('doma')) ||
                 categorySlugs.some(s => s.includes('dolma') || s.includes('doma'))) {
        category = 'Dólmãs';
      } else if (categoryNames.some(n => n.includes('acessório') || n.includes('acessorio')) ||
                 categorySlugs.some(s => s.includes('acessorio'))) {
        category = 'Acessórios';
      }
    }

    // Check product-level attributes
    if (product.attributes?.nodes) {
      product.attributes.nodes.forEach((attr) => {
        const attrName = attr.name?.toLowerCase();
        if (attrName === 'cor' || attrName === 'color' || attrName === 'pa_color') {
          if (attr.options) {
            attr.options.forEach((color) => {
              if (color && color.trim()) {
                colorsByCategory[category].add(color.trim());
              }
            });
          }
        }
      });
    }

    // Check variation-level attributes
    if (product.variations?.nodes) {
      product.variations.nodes.forEach((variation) => {
        if (variation.attributes?.nodes) {
          variation.attributes.nodes.forEach((attr) => {
            const attrName = attr.name?.toLowerCase();
            if (attrName === 'cor' || attrName === 'color' || attrName === 'pa_color') {
              if (attr.value && attr.value.trim()) {
                colorsByCategory[category].add(attr.value.trim());
              }
            }
          });
        }
      });
    }
  });

  // Show all categories found
  console.log('📚 Categorias WooCommerce encontradas:');
  Array.from(allCategories).sort().forEach(cat => console.log(`   - ${cat}`));
  console.log('');

  return colorsByCategory;
}

// Execute
extractAllColors()
  .then((colorsByCategory) => {
    console.log('🎨 CORES POR CATEGORIA:\n');
    console.log('═'.repeat(50));

    Object.entries(colorsByCategory).forEach(([category, colorSet]) => {
      const colors = Array.from(colorSet).sort();
      if (colors.length > 0) {
        console.log(`\n📁 ${category.toUpperCase()} (${colors.length} cores)`);
        console.log('─'.repeat(50));
        colors.forEach((color) => {
          console.log(`   • ${color}`);
        });
      }
    });

    const totalColors = Object.values(colorsByCategory)
      .reduce((sum, set) => sum + set.size, 0);

    console.log('\n' + '═'.repeat(50));
    console.log(`📊 TOTAL GERAL: ${totalColors} cores únicas\n`);
  })
  .catch((error) => {
    console.error('❌ Erro ao buscar cores:', error.message);
    process.exit(1);
  });
