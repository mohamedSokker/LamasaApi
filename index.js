const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./v1/config/corsAoptions");
const credentials = require("./v1/middlewares/credentials");
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine("html", require("ejs").renderFile);
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.get("/files/products/:name", (req, res) => {
  try {
    const fileName = req.params.name;
    return res.sendFile(`${__dirname}/v1/files/products/${fileName}`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: 1000,
      payment_method_types: ["card"],
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });

    // await stripe.paymentIntents.confirm(paymentIntent.id, {
    //   payment_method: "pm_card_visa",
    // });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  // const { products } = req.body;

  // // console.log(products);

  // const lineItems = products?.map((product) => ({
  //   price_data: {
  //     currency: "usd",
  //     product_data: {
  //       name: product?.desc,
  //       images: product?.img?.map((item) =>
  //         item.replace("/src/assets", `${process.env.BASE_URL}/files/products`)
  //       ),
  //     },
  //     unit_amount: Math.round(product.price * 100),
  //   },
  //   quantity: product.quantity,
  // }));

  // console.log(JSON.stringify(lineItems));

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   line_items: lineItems,
  //   mode: "payment",
  //   success_url: "http://localhost:5137/success",
  //   cancel_url: "http://localhost:5137/cancel",
  // });
  // res.json({ id: session.id });
});

const { tablesV1EndPoint } = require("./v1/apis/mainAPI");
try {
  tablesV1EndPoint(app);
} catch (error) {
  console.log(error.message);
}

const { authEndPoints } = require("./v1/apis/login&auth/api");
authEndPoints(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
