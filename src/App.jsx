import ContactSection from "./components/contactSection";
import IntroSection from "./components/introSection";
import TheBall from "./components/theBall";
import Newew from "./components/newew";
import BgCanvas from "./components/bgCanvas";
function App() {
  return (
    <div>
      <BgCanvas></BgCanvas>
      <div className="relative z-10">
        <ContactSection></ContactSection>
        <IntroSection></IntroSection>

      </div>

    </div>
  );
}
export default App;
