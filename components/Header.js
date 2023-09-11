import Link from "next/link";
import { styled } from "styled-components";
import Center from "./Center";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const StyledHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  gap: 15px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #222;
  display: flex;
  position: static;
  padding: 0;
`;

const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  padding: 0;
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>Ecommerce</Logo>
          <StyledNav>
            <NavLink href={"/products"}>All Products</NavLink>
            <NavLink href={"/cart"}>Cart ({cartProducts.length})</NavLink>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
