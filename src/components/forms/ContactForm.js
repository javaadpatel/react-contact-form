import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import axios from "axios";
import _ from "lodash";
import { Ellipsis } from "react-spinners-css";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import EmailIllustrationSrc from "images/email-illustration.svg";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;
const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`;
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;
const Textarea = styled(Input).attrs({ as: "textarea" })`
  ${tw`h-24`}
`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`;

export default ({
  subheading = "Contact Us",
  heading = (
    <>
      We're ready to <span tw="text-primary-500">get you started</span>
      <wbr />
    </>
  ),
  description = "Let's chat about how we can help you transform your production monitoring.",
  textOnLeft = true,
  id = "contact",
}) => {
  // The textOnLeft boolean prop can be used to display either the text on left or right side of the image.
  return (
    <Formik
      initialValues={{
        Email: "",
        FullName: "",
        Subject: "",
        Message: "",
      }}
      validationSchema={yup.object().shape({
        Email: yup
          .string()
          .email("Invalid email address")
          .required("Email is required"),
        FullName: yup.string().required("Name is required").max(50),
        Subject: yup.string().required("Subject is required").max(50),
        Message: yup.string().required("Message is required").max(200),
      })}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);

        //send request
        try {
          const emailFunctionUrl = "http://localhost:3005";
          const data = `Email=${values.Email}&FullName=${values.FullName}&Subject=${values.Subject}&Message=${values.Message}`;

          await axios.post(
            `${emailFunctionUrl}/.netlify/functions/server/sendEmail`,
            data,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          actions.resetForm();
          actions.setSubmitting(false);
        } catch (err) {}
      }}
      render={({ errors, handleSubmit, isSubmitting, getFieldProps }) => (
        <Container id={id}>
          <TwoColumn>
            <ImageColumn>
              <Image imageSrc={EmailIllustrationSrc} />
            </ImageColumn>
            <TextColumn textOnLeft={textOnLeft}>
              <TextContent>
                {subheading && <Subheading>{subheading}</Subheading>}
                <Heading>{heading}</Heading>
                {description && <Description>{description}</Description>}
                <Form loading={isSubmitting} onSubmit={handleSubmit}>
                  <Input
                    id="Email"
                    label="Email"
                    name="Email"
                    placeholder="Your Email Address"
                    {...getFieldProps("Email")}
                  />
                  <ErrorMessage name="Email" />
                  <Input
                    id="FullName"
                    label="FullName"
                    type="text"
                    name="FullName"
                    placeholder="Full Name"
                    {...getFieldProps("FullName")}
                  />
                  <ErrorMessage name="FullName" />
                  <Input
                    id="Subject"
                    label="Subject"
                    type="text"
                    name="Subject"
                    placeholder="Subject"
                    {...getFieldProps("Subject")}
                  />
                  <ErrorMessage name="Subject" />
                  <Textarea
                    id="Message"
                    label="Message"
                    name="Message"
                    placeholder="Your Message Here"
                    {...getFieldProps("Message")}
                  />
                  <ErrorMessage name="Message" />
                  <SubmitButton
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting || !_.isEmpty(errors)}
                  >
                    {isSubmitting ? (
                      <>
                        <Ellipsis
                          color="#f7fafc"
                          size={40}
                          style={{ position: "absolute" }}
                        />
                        Sending
                      </>
                    ) : (
                      "Send"
                    )}
                  </SubmitButton>
                </Form>
              </TextContent>
            </TextColumn>
          </TwoColumn>
        </Container>
      )}
    />
  );
};
