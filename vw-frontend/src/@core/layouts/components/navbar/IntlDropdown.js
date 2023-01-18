// ** Third Party Components
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

const IntlDropdown = () => {
  // ** Hooks
  const { i18n } = useTranslation();

  // ** Vars
  const langObj = {
    en: "English",
    de: "German",
    fr: "French",
    pt: "Portuguese",
    ar: "Arabic",
    ur: "Urdu",
  };

  // ** Function to switch Language
  const handleLangUpdate = (e, lang) => {
    e.preventDefault();
    i18n.changeLanguage(lang);
  };

  const getCurrentFlag = (lang) => {
    if (lang === "en") return "GB";
    else if (lang === "ar") return "sa";
    else if (lang === "ur") return "pk";
    else return i18n.language;
  };

  return (
    <UncontrolledDropdown
      href="/"
      tag="li"
      className="dropdown-language nav-item"
    >
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link"
        onClick={(e) => e.preventDefault()}
      >
        <ReactCountryFlag
          svg
          className="country-flag flag-icon"
          countryCode={getCurrentFlag(i18n.language)}
        />
        <span className="selected-language">{langObj[i18n.language]}</span>
      </DropdownToggle>
      <DropdownMenu className="mt-0" end>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "en")}
        >
          <ReactCountryFlag className="country-flag" countryCode="GB" svg />
          <span className="ms-1">English</span>
        </DropdownItem>
        {/* <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'fr')}>
          <ReactCountryFlag className='country-flag' countryCode='fr' svg />
          <span className='ms-1'>French</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'de')}>
          <ReactCountryFlag className='country-flag' countryCode='de' svg />
          <span className='ms-1'>German</span>
        </DropdownItem> */}
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "ar")}
        >
          <ReactCountryFlag className="country-flag" countryCode="sa" svg />
          <span className="ms-1">عربى</span>
        </DropdownItem>
        {/* <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "ur")}
        >
          <ReactCountryFlag className="country-flag" countryCode="pk" svg />
          <span className="ms-1">اردو</span>
        </DropdownItem> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default IntlDropdown;
