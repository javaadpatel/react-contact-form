import React from "react";
import "styles/globalStyles.css";
import "tailwindcss/dist/base.css";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import ContactForm from "components/forms/ContactForm";

function App() {
  return (
    <AnimationRevealPage disabled>
      <ContactForm />
    </AnimationRevealPage>
  );
}

export default App;
