const products = [
  {
    camelName: "proWiredNotebookA5Custom",
    category: "notebooks",
    description: "One signature, custom-printed Notesmith wired notebook in A5 size with laminated cover and fountain pen friendly paper.",
    discount: "bulk",
    longDescription: "One signature, custom-printed Notesmith wired notebook in A5 size with laminated cover. The notebook is filled with fountain pen friendly writing paper that works well with fountain pen inks without feathering or bleed-through, and minimal show-through (ghosting). All notebooks are made with high quality materials sourced from American vendors and are made to order in our factory in New York.",
    heightInch: "8.5",
    heightPixel: 816,
    name: "Pro Wired Notebook A5 (Custom)",
    numOfPages: 140,
    paperColor: "White",
    paperTooth: "Smooth",
    paperWeight: "70lb",
    price: 3000,
    formattedPrice: "$30.00",
    size: "A5",
    slug: "pro-wired-notebook-a5-custom",
    stripePriceId: process.env.NODE_ENV === "production" ? "price_1NzQ0pIN24Fw2SWdKJJKETku" : "price_1IbAlnIN24Fw2SWdOVRXdimr",
    weight: 9.6,
    widthInch: "5.5",
    widthPixel: 528,
    infoList: [
      "Designed and manufactured in U.S.A. only",
      "High quality, bright white and ultra-smooth writing paper",
      "Laminated covers with extra thick cover stock"
    ],
    fiftyFiftyTexts: [
      {
        heading: "Fountain pen friendly writing paper",
        text: "Our paper is designed to work well with fountain pen inks without feathering or bleed-through, and minimal show-through (ghosting).",
        alt: "Written using Pilot Iroshizuku Take-sumi (black) ink with a fine sized nib (Pilot VP)."
      },
      {
        heading: "Custom layouts on every page",
        text: "Customize your notebook's layout with different templates or create your own design.",
        alt: "A notebook with custom layouts on different pages."
      },
      {
        heading: "Laminated, extra thick covers",
        text: "Two thick cover stock sheets are pressed together and then laminated for extra durability.",
        alt: "Close-up of a water droplet resting on the cover."
      },
    ],
    hero: {
      heading: "Expertly crafted notebooks",
      text: "Our notebooks are made in-house by printing industry veterans with over 25 years of experience. You can expect a high-quality product; crafted with a focus on delivering an excellent writing experience."
    },
    infoBoxes: [
      {
        heading: "Size",
        text: "A5: 5.5 x 8.5 inches (page size), 6 x 8.5 inches (book size)"
      },
      {
        heading: "Cover",
        text: "250# (double-mounted) cover stock"
      },
      {
        heading: "Pages",
        text: "140 total pages"
      },
      {
        heading: "Paper",
        text: "White, smooth finish, 70# (104 gsm)"
      },
      {
        heading: "Binding",
        text: "Gold colored wire"
      },
      {
        heading: "Lamination",
        text: "Sand-matte textured film"
      }
    ],
    colors: [
      {
        slug: "white",
        name: "White",
        hex: "#fff"
      },
      {
        slug: "black",
        name: "Black",
        hex: "#000"
      }
    ]
  }
]

const sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  products.forEach(product => {
    const node = {
      ...product,
      id: createNodeId(`${product.name}`),
      parent: null,
      children: [],
      internal: {
        type: `Product`,
        contentDigest: createContentDigest(product),
      },
    };

    createNode(node);
  });
};

exports.sourceNodes = sourceNodes;