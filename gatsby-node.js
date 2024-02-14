const products = [
  {
    camelName: "proWiredNotebookA5Custom",
    category: "notebooks",
    custom: true,
    description: "One signature, custom-printed Notesmith wired notebook in A5 (8.5 x 5.5 inches) with 140 pages, 70lb fountain pen friendly paper, and a laminated, extra thick cover stock.",
    longDescription: "Our notebooks are made only with high-quality materials and are manufactured in our factory in New York. All custom notebooks are made-to-order according to your custom specifications.",
    heightInch: "8.5",
    heightPixel: 816,
    name: "Pro Wired Notebook A5 (Custom)",
    numOfPages: 140,
    paperColor: "Bright white",
    paperTooth: "Ultra smooth",
    paperWeight: "70lb",
    price: 3000,
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
    galleryTexts: [
      {
        heading: "Fountain pen friendly",
        text: "A close-up shot of Pilot Iroshizuku Take-sumi (black fountain pen ink) on our 70lb paper.",
        alt: "Close-up of black ink fountain pen writing on notebook paper"
      },
      {
        heading: "Sand-matte cover lamination",
        text: "The cover is laminated with a sand-matte film which acts as a water-resistant layer while also providing extra grip and texture.",
        alt: "Close-up of notebook cover with water droplet, showing water resistance"
      },
      {
        heading: "Gold colored wire binding",
        text: "Gold colored wire binding and print on the back cover only.",
        alt: "Close-up of the back-side cover"
      },
      {
        heading: "140 pages of 70lb paper",
        text: "Each notebook is filled with 140 pages of bright-white, ultra-smooth 70lb paper.",
        alt: "Close-up of the inside of the notebook, showing the paper"
      },
    ],
    hero: {
      heading: "Expertly crafted notebooks",
      text: "Our notebooks are made in-house by printing industry veterans with over 25 years of experience. You can expect a high-quality product; crafted with a focus on delivering an excellent writing experience."
    },
    infoBoxes: [
      {
        heading: "Materials",
        text: "70lb text paper, double-mounted 125lb coated cover stock with lamination, gold wire binding"
      },
      {
        heading: "Size",
        text: "5.5 x 8.5 inches (page size), 6 x 8.5 inches (book size)"
      },
      {
        heading: "Pages",
        text: "70 sheets (140 pages total)"
      },
      {
        heading: "Returns",
        text: "Returns within 14 days of purchase"
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