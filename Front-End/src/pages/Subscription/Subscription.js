import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import profile from './profile.png';
import GooglePayBtn from '../../utils/GooglePay';
import { CartContext } from '../../context/cartContext';
import tappay from '../../utils/tappay';
import api from '../../utils/api';
import Button from '../../components/Button';

const paymentInfo = [
  { title: '信用卡號', description: '**** **** **** ****' },
  { title: '有效期限', description: 'MM /YY' },
  { title: '安全碼', description: '後三碼' },
];

const plans = [
  { title: 'Premium', price: '4.99', duration: 'Month' },
  { title: 'Platinum', price: '49.99', duration: 'Year' },
];

const Wrapper = styled.div`
  width: 60%;
  border: 1px solid black;
  border-radius: 25px;
  margin: 100px auto 50px;
  padding: 63px 0 10px;
  color: #3f3a3a;
  margin-top: 50px;
  padding-top: 63px;
  padding-bottom: 10px;
  @media screen and (max-width: 1279px) {
    width: 80%;
    border: 1px solid black;
    border-radius: 25px;
    margin: 100px auto 50px;
    padding: 63px 0 79px;
    color: #3f3a3a;
    margin-top: 50px;
    padding-top: 20px;
    padding-bottom: 10px;
  }
`;

const ContentContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  justigy-content: center;
  flex-direction: row;
  align-items: center;
  margin-bottom: 34px;
  gap: 15px;
  @media screen and (max-width: 1279px) {
    flex-direction: column-reverse;
    margin-bottom: 15px;
    gap: 0px;
  }
`;

const TitleText = styled.h1`
  font-size: 24px;
  line-height: 38px;
  letter-spacing: 6.4px;
  font-weight: 700;
  @media screen and (max-width: 1279px) {
    font-size: 24px;
  }
`;

const ProfileIcon = styled.div`
  width: 44px;
  height: 44px;
  background-image: url(${profile});
`;

const SplitLine = styled.hr`
  width: 80%;
  margin-bottom: 91px;

  margin-bottom: 40px;
  margin-top: 0px;
`;

const InfoContainer = styled.div`
  width: 65%;
  margin-bottom: 45px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  @media screen and (max-width: 1279px) {
    width: 85%;
    margin-bottom: 45px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
`;

const InfoRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const QuestionTitle = styled.label`
  width: 120px;
  line-height: 19px;
`;

const Plans = styled.div`
  display: flex;
  gap: 21px;
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

const PlanContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  @media screen and (max-width: 1279px) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const PlanSelect = styled.input`
  width: 16px;
  height: 16px;
`;

const PlanTitle = styled.h2`
  color: #8b572a;
  font-weight: 700;
  line-height: 26px;
`;

const PlanPrice = styled.p`
  line-height: 26px;
`;

const QuestionInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  margin-left: 8px;
  border-radius: 8px;
  border: 1px solid #979797;
  &::placeholder {
    color: #d3d3d3;
  }
`;

const FormFieldSet = styled.fieldset`
  margin-top: 50px;

  @media screen and (max-width: 1279px) {
    margin-top: 20px;
  }
`;

const FormLegend = styled.legend`
  line-height: 19px;
  font-size: 16px;
  font-weight: bold;
  color: #3f3a3a;
  padding-bottom: 16px;
  border-bottom: 1px solid #3f3a3a;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 684px;

  ${FormLegend} + & {
    margin-top: 25px;
  }

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    margin-top: 20px;
    width: 100%;

    ${FormLegend} + & {
      margin-top: 20px;
    }
  }
`;

const FormLabel = styled.label`
  width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;

  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const FormControl = styled.input`
  width: 574px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px ${({ invalid }) => (invalid ? '#CB4042' : '#979797')};

  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    width: 100%;
  }
`;

export default function Subscription() {
  const { pricingPlan, setPricingPlan } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const cardNumberRef = useRef();
  const cardExpirationDateRef = useRef();
  const cardCCVRef = useRef();

  function handleInput(e, data) {
    const input = e.target.value;
    setPricingPlan({ plan: input, price: data.price });
  }

  useEffect(() => {
    const setupTappay = async () => {
      await tappay.setupSDK();
      tappay.setupCard(
        cardNumberRef.current,
        cardExpirationDateRef.current,
        cardCCVRef.current
      );
    };
    setupTappay();
  }, []);

  // useEffect(() => {
  //   if (pricingPlan) {
  //     console.log(pricingPlan);
  //   }
  // }, [pricingPlan]);

  async function checkout(e) {
    try {
      setLoading(true);

      const token = localStorage.getItem('loginToken');

      if (!token) {
        window.alert('請登入會員');
        return;
      }

      // if (pricingPlan === '') {
      //   window.alert('請選擇方案');
      //   return;
      // }

      if (!tappay.canGetPrime()) {
        window.alert('付款資料輸入有誤');
        return;
      }

      const result = await tappay.getPrime();
      if (result.status !== 0) {
        window.alert('付款資料輸入有誤');
        return;
      }

      const { data } = await api.checkout(
        {
          prime: result.card.prime,
          order: {
            shipping: 'delivery',
            payment: 'credit_card',
            // subtotal,
            // freight,
            // total: subtotal + freight,
            // recipient,
            // list: cartItems,
          },
        },
        token
      );
      // window.alert('付款成功');
      // setCartItems([]);
      // navigate('/thankyou', { state: { orderNumber: data.number } });
      e.preventDefault();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper>
      <ContentContainer
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Title>
          <TitleText>成為尊榮會員</TitleText>
          <ProfileIcon />
        </Title>
        <SplitLine />
        <InfoContainer>
          <InfoRow>
            <QuestionTitle>訂閱方案</QuestionTitle>
            <Plans>
              {plans.map((plan) => (
                <PlanContainer>
                  <PlanSelect
                    type='radio'
                    name={plan.title}
                    value={plan.title}
                    checked={plan.title === pricingPlan.plan}
                    onChange={(e) => {
                      handleInput(e, plan);
                    }}
                  />
                  <PlanTitle>{plan.title}</PlanTitle>
                  <PlanPrice>{`$${plan.price} USD / ${plan.duration}`}</PlanPrice>
                </PlanContainer>
              ))}
            </Plans>
          </InfoRow>
          {/* <GooglePayBtn /> */}
          <FormFieldSet>
            <FormLegend>付款資料</FormLegend>
            <FormGroup>
              <FormLabel>信用卡號碼</FormLabel>
              <FormControl as='div' ref={cardNumberRef} />
            </FormGroup>
            <FormGroup>
              <FormLabel>有效期限</FormLabel>
              <FormControl as='div' ref={cardExpirationDateRef} />
            </FormGroup>
            <FormGroup>
              <FormLabel>安全碼</FormLabel>
              <FormControl as='div' ref={cardCCVRef} />
            </FormGroup>
          </FormFieldSet>
        </InfoContainer>
        <Button
          loading={loading}
          onClick={() => {
            checkout();
          }}
        >
          確認付款
        </Button>
      </ContentContainer>
    </Wrapper>
  );
}
