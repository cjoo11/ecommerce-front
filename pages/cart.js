import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import StateList from "@/components/StateList";
import Table from "@/components/Table";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  const router = useRouter();

  useEffect(() => {
    if (window.location.href.includes("success")) {
      setOrderSuccess(true);
      clearCart();
    } else {
      setOrderSuccess(false);
    }
  }, [router.asPath, clearCart]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      address,
      city,
      state,
      zipCode,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price =
      products.find((product) => product._id === productId)?.price || 0;
    total += price;
  }

  if (orderSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <WhiteBox>
              <h1>Thank you for your order!</h1>
              <p>We will email you when your order is shipped.</p>
            </WhiteBox>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <WhiteBox>
            <h2>Cart</h2>
            {!cartProducts?.length && <div>Your cart is empty.</div>}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </Button>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </Button>
                      </td>
                      <td>
                        $
                        {(
                          cartProducts.filter((id) => id === product._id)
                            .length * product.price
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </WhiteBox>
          {!!cartProducts?.length && (
            <WhiteBox>
              <h2>Order Information</h2>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Address"
                value={address}
                name="address"
                onChange={(e) => setAddress(e.target.value)}
              />
              <CityHolder>
                <Input
                  type="text"
                  placeholder="City"
                  value={city}
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                />
                <StateList
                  value={state}
                  name="state"
                  onChange={(e) => setState(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Zip Code"
                  value={zipCode}
                  name="zipCode"
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </CityHolder>
              <Button $black $block onClick={goToPayment}>
                Continue to Payment
              </Button>
            </WhiteBox>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
