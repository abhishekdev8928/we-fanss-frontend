import product1 from '../../assets/images/product/img-1.png'
import product2 from '../../assets/images/product/img-2.png'
import product3 from '../../assets/images/product/img-3.png'
import product4 from '../../assets/images/product/img-4.png'

import company1 from '../../assets/images/companies/img-1.png';
import company2 from '../../assets/images/companies/img-2.png';
import company3 from '../../assets/images/companies/img-3.png';
import company4 from '../../assets/images/companies/img-4.png';
import company5 from '../../assets/images/companies/img-5.png';
import company6 from '../../assets/images/companies/img-6.png';
import company7 from '../../assets/images/companies/img-7.png';
import company8 from '../../assets/images/companies/img-8.png';

const productsData = [
  {
    id: 1,
    image: product1,
    name: "Full sleeve T-shirt",
    extrades: "Blue color, T-shirt",
    description: "Lorem ipsum dolor sit consec te imperdiet iaculis ipsum..",
    date: "22/05/2017",
    newprice: 240,
    islable: true,
    lable: 'Trending',
    extraimgs :[product2,product3,product4],
    shortspecifications: ['Full Sleeve', 'Cotton', 'All Sizes available', '4 Different Color'],
    category: "T-shirts",
    reviews: 132,
    shortservices:[
      { icon: "mdi-sync", value: "10 Days Replacement" },
      { icon: "mdi-currency-usd-circle", value: "Cash on Delivery available" },
    ],
    colorOptions: [
      { image: product2, color: "Blue" },
      { image: product3, color: "Cyan" },
      { image: product4, color: "Green" },
    ],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Jack & Jones" },
      { type: "Color", value: "Blue" },
      { type: "Material", value: "Cotton" },
      { type: "Weight", value: "140 Gm" },
    ],
  },
  // {
  //   id: 2,
  //   image: product2,
  //   name: "Half sleeve T-shirt",
  //   extrades: "Half sleeve, T-shirt",
  //   description: "Lorem ipsum dolor sit consec te imperdiet iaculis ipsum..",
  //   date: "22/05/2017",
  //   oldprice: "$240",
  //   newprice: 225,
  //   isOffer:true,
  //   offer:25,
  //   extraimgs :[product1,product3,product4],
  //   shortspecifications: ['Full Sleeve', 'Cotton', 'All Sizes available', '4 Different Color'],
  //   category: "T-shirts",
  //   reviews: 132,
  //   shortservices:[
  //     { icon: "mdi-sync", value: "10 Days Replacement" },
  //     { icon: "mdi-currency-usd-circle", value: "Cash on Delivery available" },
  //   ],
  //   colorOptions: [
  //     { image: product2, color: "Blue" },
  //     { image: product3, color: "Cyan" },
  //     { image: product4, color: "Green" },
  //   ],
  //   specification: [
  //     { type: "Category", value: "T-shirt" },
  //     { type: "Brand", value: "Jack & Jones" },
  //     { type: "Color", value: "Blue" },
  //     { type: "Material", value: "Cotton" },
  //     { type: "Weight", value: "140 Gm" },
  //   ],
  // },
  // {
  //   id: 3,
  //   image: product3,
  //   name: "Hoodie (Green)",
  //   extrades: "Green color, Hoodie",
  //   description: "Lorem ipsum dolor sit consec te imperdiet iaculis ipsum..",
  //   date: "22/05/2017",
  //   oldprice: "$290",
  //   newprice: 275,
  //   islike:true,
  //   extraimgs :[product1,product2,product4],
  //   shortspecifications: ['Full Sleeve', 'Cotton', 'All Sizes available', '4 Different Color'],
  //   category: "T-shirts",
  //   reviews: 132,
  //   shortservices:[
  //     { icon: "mdi-sync", value: "10 Days Replacement" },
  //     { icon: "mdi-currency-usd-circle", value: "Cash on Delivery available" },
  //   ],
  //   colorOptions: [
  //     { image: product2, color: "Blue" },
  //     { image: product3, color: "Cyan" },
  //     { image: product4, color: "Green" },
  //   ],
  //   specification: [
  //     { type: "Category", value: "T-shirt" },
  //     { type: "Brand", value: "Jack & Jones" },
  //     { type: "Color", value: "Blue" },
  //     { type: "Material", value: "Cotton" },
  //     { type: "Weight", value: "140 Gm" },
  //   ],
  // },
  // {
  //   id: 4,
  //   image: product4,
  //   name: "Full sleeve T-shirt",
  //   extrades: "Blue color, T-shirt",
  //   description: "Lorem ipsum dolor sit consec te imperdiet iaculis ipsum..",
  //   date: "22/05/2017",
  //   oldprice: "$290",
  //   newprice: 275,
  //   extraimgs :[product1,product2,product3],
  //   shortspecifications: ['Full Sleeve', 'Cotton', 'All Sizes available', '4 Different Color'],
  //   category: "T-shirts",
  //   reviews: 132,
  //   shortservices:[
  //     { icon: "mdi-sync", value: "10 Days Replacement" },
  //     { icon: "mdi-currency-usd-circle", value: "Cash on Delivery available" },
  //   ],
  //   colorOptions: [
  //     { image: product2,color: "Blue" },
  //     { image: product3,color: "Cyan" },
  //     { image: product4,color: "Green" },
  //   ],
  //   specification: [
  //     { type: "Category", value: "T-shirt" },
  //     { type: "Brand", value: "Jack & Jones" },
  //     { type: "Color", value: "Blue" },
  //     { type: "Material", value: "Cotton" },
  //     { type: "Weight", value: "140 Gm" },
  //   ],
  // },
  // {
  //   id: 5,
  //   image: product5,
  //   name: "Hoodie (Green)",
  //   extrades: "Gray color, Hoodie",
  //   description: "Lorem ipsum dolor sit consec te imperdiet iaculis ipsum..",
  //   date: "22/05/2017",
  //   oldprice: "$290",
  //   newprice: 275,
  //   islike:true,
  //   extraimgs :[product5,product2,product3],
  //   shortspecifications: ['Full Sleeve', 'Cotton', 'All Sizes available', '4 Different Color'],
  //   category: "T-shirts",
  //   reviews: 132,
  //   shortservices:[
  //     { icon: "mdi-sync", value: "10 Days Replacement" },
  //     { icon: "mdi-currency-usd-circle", value: "Cash on Delivery available" },
  //   ],
  //   colorOptions: [
  //     { image: product2, color: "Blue" },
  //     { image: product3, color: "Cyan" },
  //     { image: product4, color: "Green" },
  //   ],
  //   specification: [
  //     { type: "Category", value: "T-shirt" },
  //     { type: "Brand", value: "Jack & Jones" },
  //     { type: "Color", value: "Blue" },
  //     { type: "Material", value: "Cotton" },
  //     { type: "Weight", value: "140 Gm" },
  //   ],
  // },
  // {
  //   id: 7,
  //   image: product6,
  //   name: "Full sleeve T-shirt",
  //   extrades: "Blue color, T-shirt",
  //   description: "Lorem ipsum dolor sit consec te imperdiet iaculis ipsum..",
  //   date: "22/05/2017",
  //   oldprice: "$242",
  //   newprice: 0,
  //   extraimgs :[product6,product4,product3],
  //   shortspecifications: ['Full Sleeve', 'Cotton', 'All Sizes available', '4 Different Color'],
  //   category: "T-shirts",
  //   reviews: 132,
  //   shortservices:[
  //     { icon: "mdi-sync", value: "10 Days Replacement" },
  //     { icon: "mdi-currency-usd-circle", value: "Cash on Delivery available" },
  //   ],
  //   colorOptions: [
  //     { image: product2, color: "Blue" },
  //     { image: product3, color: "Cyan" },
  //     { image: product4, color: "Green" },
  //   ],
  //   specification: [
  //     { type: "Category", value: "T-shirt" },
  //     { type: "Brand", value: "Jack & Jones" },
  //     { type: "Color", value: "Blue" },
  //     { type: "Material", value: "Cotton" },
  //     { type: "Weight", value: "140 Gm" },
  //   ],
  // },
]

const recentProducts = [
  {
    id: 1,
    img: "img7",
    name: "Wirless Headphone",
    link: "",
    rating: 4,
    oldPrice: 240,
    newPrice: 225,
  },
  {
    id: 2,
    img: "img4",
    name: "Phone patterned cases",
    link: "",
    rating: 3,
    oldPrice: 150,
    newPrice: 145,
  },
  {
    id: 3,
    img: "img6",
    name: "Phone Dark Patterned cases",
    link: "",
    rating: 4,
    oldPrice: 138,
    newPrice: 135,
  },
]

const comments = [
  {
    id: 1,
    name: "James",
    description:
      "To an English person, it will seem like simplified English, as a skeptical Cambridge",
    date: "11 Feb, 2020",
  },
  {
    id: 2,
    name: "David",
    description:
      "Everyone realizes why a new common language would be desirable",
    date: "22 Jan, 2020",
  },
  {
    id: 3,
    name: "Scott",
    description:
      "If several languages coalesce, the grammar of the resulting",
    date: "04 Jan, 2020",
  },
]

const discountData = [
  { label: "Less than 10%", value: 0 },
  { label: "10% or more", value: 10 },
  { label: "20% or more", value: 20 },
  { label: "30% or more", value: 30 },
  { label: "40% or more", value: 40 },
  { label: "50% or more", value: 50 },
]

const orders = [
  {
    id: "1",
    orderid: "#NZ1572",
    orderdate: "04 Apr, 2020",
    billingname: "Lasse C. Overgaard",
    total: "$172",
    badge: "success",
    paymentStatus: "Paid",
  },
  {
    id: "2",
    orderid: "#NZ1571",
    orderdate: "03 Apr, 2020",
    billingname: "Johan E. Knudsen",
    total: "$165",
    badge: "warning",
    paymentStatus: "unpaid",
  },
  {
    id: "3",
    orderid: "#NZ1570",
    orderdate: "03 Apr, 2020",
    billingname: "Lasse C. Overgaard",
    total: "$146",
    badge: "success",
    paymentStatus: "Paid",
  },
  {
    id: "4",
    orderid: "#NZ1569",
    orderdate: "02 Apr, 2020",
    billingname: "Nikolaj S. Henriksen",
    total: "$183",
    badge: "success",
    paymentStatus: "Paid",
  },
  {
    id: "5",
    orderid: "#NZ1568",
    orderdate: "01 Apr, 2020",
    billingname: "Nikolaj S. Henriksen",
    total: "$160",
    badge: "danger",
    paymentStatus: "Chargeback",
  },
  {
    id: "6",
    orderid: "#NZ1567",
    orderdate: "31 Mar, 2020",
    billingname: "Herbert C. Patton",
    total: "$105",
    badge: "warning",
    paymentStatus: "unpaid",
  },
  {
    id: "7",
    orderid: "#NZ1566",
    orderdate: "30 Mar, 2020",
    billingname: "Nikolaj S. Henriksen",
    total: "$112",
    badge: "success",
    paymentStatus: "Paid",
  },
  {
    id: "8",
    orderid: "#NZ1565",
    orderdate: "29 Mar, 2020",
    billingname: "Mathias N. Klausen",
    total: "$123",
    badge: "success",
    paymentStatus: "Paid",
  },
  {
    id: "9",
    orderid: "#NZ1563",
    orderdate: "28 Mar, 2020",
    billingname: "Herbert C. Patton",
    total: "$141",
    badge: "success",
    paymentStatus: "Paid",
  },
  {
    id: "10",
    orderid: "#NZ1562",
    orderdate: "28 Mar, 2020",
    billingname: "Lasse C. Overgaard",
    total: "$164",
    badge: "warning",
    paymentStatus: "unpaid",
  },
  {
    id: "11",
    orderid: "#NZ1561",
    orderdate: "27 Mar, 2020",
    billingname: "James Hamilton",
    total: "$154",
    badge: "success",
    paymentStatus: "Paid",
  },
]

const customers = [
  {
    username: "Angelyn Hardin",
    email: "AngelynHardin@dayrep.com",
    phone: "913-248-2690",
    amount: "$ 2435",
    date: "05 Apr, 2020"
  },
  {
    username: "Carrie Thompson",
    email: "CarrieThompson@rhyta.com",
    phone: "734-819-9286",
    amount: "$ 2653",
    date: "04 Apr, 2020"
  },
  {
    username: "Kathleen Haller",
    email: "KathleenHaller@dayrep.com",
    phone: "313-742-3333",
    amount: "$ 2135",
    date: "03 Apr, 2020"
  },
  {
    username: "Martha Beasley",
    email: "MarthaBeasley@teleworm.us",
    phone: "301-330-5745",
    amount: "$ 2698",
    date: "02 Apr, 2020"
  },
  {
    username: "Kathryn Hudson",
    email: "KathrynHudson@armyspy.com",
    phone: "414-453-5725",
    amount: "$ 2758",
    date: "02 Apr, 2020"
  },
  {
    username: "Robert Bott",
    email: "RobertBott@armyspy.com",
    phone: "712-237-9899",
    amount: "$ 2836",
    date: "01 Apr, 2020"
  },
  {
    username: "Mary McDonald",
    email: "MaryMcDonald@armyspy.com",
    phone: "317-510-25554",
    amount: "$ 3245",
    date: "31 Mar, 2020"
  },
  {
    username: "Keith Rainey",
    email: "KeithRainey@jourrapide.com",
    phone: "214-712-1810",
    amount: "$ 3125",
    date: "30 Mar, 2020"
  },
  {
    username: "Anthony Russo",
    email: "AnthonyRusso@jourrapide.com",
    phone: "412-371-8864",
    amount: "$ 2456",
    date: "30 Mar, 2020"
  },
  {
    username: "Donna Betz",
    email: "DonnaBetz@jourrapide.com",
    phone: "626-583-5779",
    amount: "$ 3423",
    date: "29 Mar, 2020"
  },
  {
    username: "Angie Andres",
    email: "AngieAndres@armyspy.com",
    phone: "213-494-4527",
    amount: "$ 3245",
    date: "28 Apr, 2020"
  }
]

const products = [
  {
    id: 1,
    name: "Airi Satou",
    position: "Accountant",
    office: "Tokyo",
    age: "33",
    startdate: "2008/11/28",
    salary: "$162,700",
  },

  {
    id: 2,
    name: "Angelica Ramos",
    position: "Chief Executive Officer (CEO)",
    office: "London",
    age: "47",
    startdate: "2009/10/09",
    salary: "$1,200,000",
  },

  {
    id: 3,
    name: "Ashton Cox",
    position: "Junior Technical Author",
    office: "San Francisco",
    age: "66",
    startdate: "2009/01/12",
    salary: "$86,000",
  },

  {
    id: 4,
    name: "Bradley Greer",
    position: "Software Engineer",
    office: "London",
    age: "41",
    startdate: "2012/10/13",
    salary: "$132,000",
  },

  {
    id: 5,
    name: "Brenden Wagner",
    position: "Software Engineer",
    office: "San Francisco",
    age: "28",
    startdate: "2011/06/07",
    salary: "$206,850",
  },

  {
    id: 6,
    name: "Brielle Williamson",
    position: "Integration Specialist",
    office: "New York",
    age: "61",
    startdate: "2012/12/02",
    salary: "$372,000",
  },

  {
    id: 7,
    name: "Bruno Nash",
    position: "Software Engineer",
    office: "London",
    age: "38",
    startdate: "2011/05/03",
    salary: "$163,500",
  },

  {
    id: 8,
    name: "Caesar Vance",
    position: "Pre-Sales Support",
    office: "New York",
    age: "21",
    startdate: "2011/12/12",
    salary: "$106,450",
  },

  {
    id: 9,
    name: "Cara Stevens",
    position: "Sales Assistant",
    office: "New York",
    age: "46",
    startdate: "2011/12/06",
    salary: "$145,600",
  },

  {
    id: 10,
    name: "Cedric Kelly",
    position: "Senior Javascript Developer",
    office: "Edinburgh",
    age: "22",
    startdate: "2012/03/29",
    salary: "$433,060",
  },

  {
    id: 11,
    name: "Marshall",
    position: "Regional Director",
    office: "San Francisco",
    age: "36",
    startdate: "2008/10/16",
    salary: "$470,600",
  },

  {
    id: 12,
    name: "Hurst",
    position: "Javascript Developer",
    office: "San Francisco",
    age: "39",
    startdate: "2009/09/15",
    salary: "$205,500",
  },

  {
    id: 13,
    name: "Rios",
    position: "Personnel Lead",
    office: "Edinburgh",
    age: "35",
    startdate: "2012/09/26",
    salary: "$217,500",
  },

  {
    id: 14,
    name: "Snider",
    position: "Customer Support",
    office: "New York",
    age: "27",
    startdate: "2011/01/25",
    salary: "$112,000",
  },

  {
    id: 15,
    name: "Wilder",
    position: "Sales Assistant",
    office: "Sidney",
    age: "23",
    startdate: "2010/09/20",
    salary: "$85,600",
  },

  {
    id: 16,
    name: "Camacho",
    position: "Support Engineer",
    office: "San Francisco",
    age: "47",
    startdate: "2009/07/07",
    salary: "$87,500",
  },

  {
    id: 17,
    name: "Green",
    position: "Chief Operating Officer (COO)",
    office: "San Francisco",
    age: "48",
    startdate: "2010/03/11",
    salary: "$850,000",
  },

  {
    id: 18,
    name: "Winters",
    position: "Accountant",
    office: "Tokyo",
    age: "63",
    startdate: "2011/07/25",
    salary: "$170,750",
  },

  {
    id: 19,
    name: "Cortez",
    position: "Team Leader",
    office: "San Francisco",
    age: "22",
    startdate: "2008/10/26",
    salary: "$235,500",
  },

  {
    id: 20,
    name: "Joyce",
    position: "Developer",
    office: "Edinburgh",
    age: "42",
    startdate: "2010/12/22",
    salary: "$92,575",
  },

  {
    id: 21,
    name: "Gloria Little",
    position: "Systems Administrator",
    office: "New York",
    age: "59",
    startdate: "2009/04/10",
    salary: "$237,500",
  },

  {
    id: 22,
    name: "Haley Kennedy",
    position: "Senior Marketing Desi,ner",
    office: "London",
    age: "43",
    startdate: "2012/12/18",
    salary: "$313,500",
  },

  {
    id: 23,
    name: "Hermione Butler",
    position: "Regional Director",
    office: "London",
    age: "47",
    startdate: "2011/03/21",
    salary: "$356,250",
  },

  {
    id: 24,
    name: "Herrod Chandler",
    position: "Sales Assistant",
    office: "San Francisco",
    age: "59",
    startdate: "2012/08/06",
    salary: "$137,500",
  },

  {
    id: 25,
    name: "Hope Fuentes",
    position: "Secretary",
    office: "San Francisco",
    age: "41",
    startdate: "2010/02/12",
    salary: "$109,850",
  },

  {
    id: 26,
    name: "Howard Hatfield",
    position: "Office Manager",
    office: "San Francisco",
    age: "51",
    startdate: "2008/12/16",
    salary: "$164,500",
  },

  {
    id: 27,
    name: "Jackson Bradshaw",
    position: "Director",
    office: "New York",
    age: "65",
    startdate: "2008/09/26",
    salary: "$645,750",
  },

  {
    id: 28,
    name: "Jena Gaines",
    position: "Office Manager",
    office: "London",
    age: "30",
    startdate: "2008/12/19",
    salary: "$90,560",
  },

  {
    id: 29,
    name: "Jenette Caldwell",
    position: "Development Lead",
    office: "New York",
    age: "30",
    startdate: "2011/09/03",
    salary: "$345,000",
  },

  {
    id: 30,
    name: "Jennifer Acosta",
    position: "Junior Javascript Devel,per",
    office: "Edinburgh",
    age: "43",
    startdate: "2013/02/01",
    salary: "$75,650",
  },
];

const cartData = {
  products: [
    {
      id: 1,
      img: product1,
      name: "Full sleeve T-shirt",
      color: "Blue",
      price: "240",
      data_attr: 2,
      total: 480,
    },
    {
      id: 2,
      img: product2,
      name: "Half sleeve T-shirt",
      color: "Red",
      price: "225",
      data_attr: 1,
      total: 225,
    },
    {
      id: 3,
      img: product3,
      name: "Hoodie (Green)",
      color: "Green",
      price: "275",
      data_attr: 2,
      total: 550,
    },
    {
      id: 4,
      img: product4,
      name: "Hoodie (Gray)",
      color: "Gray",
      price: "275",
      data_attr: 1,
      total: 275,
    },
  ],
  orderSummary: {
    grandTotal: "$ 1,857",
    discount: "$ 157",
    shippingCharge: "$ 25",
    estimatedTax: "$ 19.22",
    total: "$ 1744.22",
  },
}

const customerData = [
  {
    id: "1",
    customerid: "#NZ1562",
    username: "Stephen Rash",
    phone: "325-250-1106",
    email: "StephenRash@teleworm.us",
    address: "2470 Grove Street Bethpage, NY 11714",
    rating: "4.2",
    walletBalance: "$5412",
    joiningDate: "07 Oct, 2019",
  },
  {
    id: "2",
    customerid: "#NZ1561",
    username: "Juan Mays",
    phone: "443-523-4726",
    email: "JuanMays@armyspy.com",
    address: "3755 Harron Drive Salisbury, MD 21875",
    rating: "4.0",
    walletBalance: "$5632",
    joiningDate: "06 Oct, 2019",
  },
  {
    id: "3",
    customerid: "#NZ1560",
    username: "Scott Henry",
    phone: "704-629-9535",
    email: "ScottHenry@jourrapide.com",
    address: "3632 Snyder Avenue Bessemer City, NC 2801",
    rating: "4.4",
    walletBalance: "$7523",
    joiningDate: "06 Oct, 2019",
  },
  {
    id: "4",
    customerid: "#NZ1559",
    username: "Cody Menendez",
    phone: "701-832-5838",
    email: "CodyMenendez@armyspy.com",
    address: "4401 Findley Avenue Minot, ND 58701",
    rating: "4.1",
    walletBalance: "$6,25",
    joiningDate: "05 Oct, 2019",
  },
  {
    id: "5",
    customerid: "#NZ1558",
    username: "Jason Merino",
    phone: "706-219-4095",
    email: "JasonMerino@dayrep.com",
    address: "3159 Holly Street Cleveland, GA 30528",
    rating: "3.8",
    walletBalance: "$4523",
    joiningDate: "04 Oct, 2019",
  },
  {
    id: "6",
    customerid: "#NZ1557",
    username: "Kyle Aquino",
    phone: "415-232-5443",
    email: "KyleAquino@teleworm.us",
    address: "4861 Delaware Avenue San Francisco, CA 94143",
    rating: "4.0",
    walletBalance: "$5412",
    joiningDate: "03 Oct, 2019",
  },
  {
    id: "7",
    customerid: "#NZ1556",
    username: "David Gaul",
    phone: "314-483-4679",
    email: "DavidGaul@teleworm.us",
    address: "1207 Cottrill Lane Stlouis, MO 63101",
    rating: "4.2",
    walletBalance: "$6180",
    joiningDate: "02 Oct, 2019",
  },
  {
    id: "8",
    customerid: "#NZ1555",
    username: "John McCray",
    phone: "253-661-7551",
    email: "JohnMcCray@armyspy.com",
    address: "3309 Horizon Circle Tacoma, WA 98423",
    rating: "4.1",
    walletBalance: "$52870",
    joiningDate: "02 Oct, 2019",
  },
]

const shops = [
  {
    id: 1,
    img : company1, 
    name: "Nedick's",
    author: 'Wayne McClain',
    product: 86,
    balance: "12,456"
  },
  {
    id: 2,
    img : company2, 
    author: "David Marshall",
    name: "Brendle's",
    product: 72,
    balance: "10,352",
    profileLink: "#",
  },
  {
    id: 3,
    img : company3, 
    author: "Katia Stapleton",
    name: "Tech Hifi",
    product: 75,
    balance: "9,963",
    profileLink: "#",
  },
  {
    id: 4,
    img : company4, 
    author: "Andrew Bivens",
    name: "Lafayette",
    product: 65,
    balance: "14,568",
    profileLink: "#",
  },
  {
    id: 5,
    img : company5, 
    author: "Mae Rankin",
    name: "Packer",
    product: 82,
    balance: "16,445",
    profileLink: "#",
  },
  {
    id: 6,
    img : company6, 
    author: "Brian Correa",
    name: "Micro Design",
    product: 71,
    balance: "11,523",
    profileLink: "#",
  },
  {
    id: 7,
    img : company7, 
    author: "Dean Odom",
    name: "Keeney's",
    product: 66,
    balance: "13,478",
    profileLink: "#",
  },
  {
    id: 8,
    img : company8, 
    author: "John McLeroy",
    name: "Tech Hifi",
    product: 58,
    balance: "14,654",
    profileLink: "#",
  }
]

export {
  productsData,
  recentProducts,
  comments,
  discountData,
  orders,
  shops,
  customerData,
  cartData,
  customers,
  products
}
