import { getBaseUrl } from "@/lib/utils";
import { type OrderInfo } from "@/server/api/routers/orders";
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type RecipeEmailProps = {
  userName: string;
  order: NonNullable<OrderInfo>;
};

const baseUrl = getBaseUrl();

const ReceiptEmail = ({ userName, order }: RecipeEmailProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#16a34a",
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>YUMMY Receipt</Preview>
        <Body className="bg-[#f6f9fc] py-3">
          <Container className="border border-gray-100 bg-white p-10">
            <div className="flex justify-center">
              <Img
                src={`${baseUrl}/assets/images/yummy.png`}
                width="200"
                height="188"
                alt="Yummy"
              />
            </div>
            <Section>
              <Text className="text-lg font-medium leading-6 text-gray-700">
                Hi {userName},
              </Text>
              <Text className="text-base font-light leading-6 text-gray-700">
                Thank you for your order! We&apos;re excited to have you on
                board.
              </Text>
              <Text className="text-base font-light leading-6 text-gray-700">
                Here&apos;s a summary of your order:
              </Text>
              <Container className="rounded-md bg-gray-100 p-6">
                <Text className="m-0 text-center text-xl leading-6">
                  Receipt
                </Text>
                <Text className="text-center text-base leading-6">
                  Order #{order?.id}
                </Text>
                {order?.items.map((item) => (
                  <Section key={item.id}>
                    <Row className="mt-4">
                      <Column className="text-base font-semibold leading-6">
                        {item.name_en} x {item.quantity}
                      </Column>
                      <Column className="text-end text-sm leading-5 text-gray-600">
                        ${item.price}
                      </Column>
                    </Row>
                    {item.size !== "None" && (
                      <Row>
                        <Text className="m-0 text-xs leading-5 text-gray-600">
                          Size: {item.size}
                        </Text>
                      </Row>
                    )}
                    {item.additions && item.additions.length > 0 && (
                      <Row className="text-xs leading-5 text-gray-400">
                        <Text className="m-0 text-xs leading-5 text-gray-600">
                          Additions: {item.additions.join(" - ")}
                        </Text>
                      </Row>
                    )}
                  </Section>
                ))}
                <Row className="mt-4">
                  <Column className="text-base font-semibold leading-6">
                    Subtotal
                  </Column>
                  <Column className="text-end text-sm leading-5 text-gray-600">
                    ${Number(order.subTotal).toFixed(2)}
                  </Column>
                </Row>
                <Row className="mt-4">
                  <Column className="text-base font-semibold leading-6">
                    Shipping (Delivery fee)
                  </Column>
                  <Column className="text-end text-sm leading-5 text-gray-600">
                    ${order.deliveryFee}
                  </Column>
                </Row>
                <Row className="mt-4">
                  <Column className="text-base font-semibold leading-6">
                    TOTAL
                  </Column>
                  <Column className="text-end text-sm leading-5 text-gray-600">
                    ${order.total}
                  </Column>
                </Row>
              </Container>
              <Text className="text-base leading-6">
                Thanks,
                <br />
                Yummy Support Team
              </Text>
              <Text className="mt-6 bg-gray-100 py-2 text-center text-xs text-gray-400">
                Copyright © 2024 <Link href={baseUrl}>YUMMY</Link> Inc. All
                rights reserved
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default ReceiptEmail;
