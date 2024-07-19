import { getBaseUrl } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ResetPasswordEmailProps = {
  userName: string;
  token: string;
};

const baseUrl = getBaseUrl();

export const ResetPasswordEmail = ({
  userName,
  token,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>YUMMY reset password</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={Div}>
            <Img
              src={`${baseUrl}/assets/images/yummy.png`}
              width="200"
              height="188"
              alt="Yummy"
            />
          </div>
          <Section>
            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Someone recently requested a password change for your Yummy
              account. If this was you, you can set a new password here:
            </Text>
            <div style={Div}>
              <Button
                style={button}
                href={`${baseUrl}/reset-password?token=${token}`}
              >
                Reset password
              </Button>
            </div>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              Remember to use a password that is both strong and unique to your
              account.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            {/* <Text style={text}>Happy Dropboxing!</Text> */}
            <Text style={paragraph}>
              Thanks,
              <br />
              Yummy Support Team
            </Text>
            <Text style={footerCopyright}>
              Copyright © 2024 <Link href={baseUrl}>YUMMY</Link> Inc. All
              rights reserved
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#16a34a",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
  cursor: "pointer",
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};
const footerCopyright = {
  margin: "25px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
  backgroundColor: "#f3f4f6",
  padding: "10px 0",
};
const Div = {
  display: "flex",
  justifyContent: "center",
};
