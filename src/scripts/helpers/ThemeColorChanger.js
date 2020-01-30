import Color from "color";
import WaitForElement from "./WaitForElement";
import TimedLoop from "./TimedLoop";

const MAX_LUMINOSITY = 0.52
const COLOR_STORE_KEY = "themeColor";
const DEFAULT_THEME_COLOR = "#4fb3f6";
const STYLE_ELEMENT_ID = "PersonalColors";

class ThemeColorChanger {
  constructor(primaryColor, isPreview = false) {
    this.primaryColor = String(primaryColor || "transparent");
    this.isPreview = isPreview;
    this.storedColor = window.localStorage.getItem(COLOR_STORE_KEY);
    this.colors = [];
    this.fontColor = "#333";
    this.fixedPrimaryColor = this.primaryColor;

    this.Init();
  }
  async Init() {
    this.StoreColor();

    let head = await WaitForElement("head");
    this.head = head[0];

    this.PrepareStyleElement();
    TimedLoop(this.RenderStyleElement.bind(this), { expireTime: 3 });
    this.RenderStyles();
  }
  StoreColor() {
    if (
      !this.isPreview &&
      (
        !this.storedColor ||
        (
          this.storedColor.toLowerCase() != this.primaryColor.toLowerCase()
        )
      )
    ) {
      window.localStorage.setItem(COLOR_STORE_KEY, this.primaryColor);
    }
  }
  PrepareStyleElement() {
    this.styleElement = document.getElementById(STYLE_ELEMENT_ID);

    if (!this.styleElement) {
      this.styleElement = document.createElement('style');

      if (this.styleElement instanceof HTMLStyleElement) {
        this.styleElement.type = 'text/css';
        this.styleElement.id = STYLE_ELEMENT_ID;
        this.styleElement.dataset.addedByExtension = "true";
      }
    }
  }
  RenderStyleElement() {
    this.head.appendChild(this.styleElement);
  }
  RenderStyles() {
    this.PrepareColors();
    this.PrepareBackgrounStyle();
    this.PrepareStyles();
    this.ChangeStyles();
  }
  PrepareColors() {
    if (this.IsMulticolor()) {
      this.fontColor = "#fff";
      this.colors = this.primaryColor.split(",")
        .map(color => color.toLowerCase());
    } else {
      //this.PrepareMultiColor();
      this.colors = [this.primaryColor];
      this.SetFontColor();
    }
  }
  IsMulticolor() {
    return this.primaryColor.indexOf(",") >= 0
  }
  SetFontColor() {
    let color;

    try {
      color = Color(this.primaryColor);
    } catch (error) {
      color = Color(DEFAULT_THEME_COLOR);
    }

    if (this.IsDark(color)) {
      this.fontColor = "#fff";
    }

    if (!this.IsDark(color, 0.6)) {
      this.fixedPrimaryColor = color.hsl().lightness(75);
    }
  }
  IsDark(color, limit) {
    if (typeof color == "string") {
      color = Color(color);
    }

    return color.luminosity() < (limit || MAX_LUMINOSITY);
  }
  PrepareMultiColor() {
    let secondaryColor = Color(this.primaryColor);

    if (!this.IsDark(secondaryColor)) {
      secondaryColor = secondaryColor.lighten(.3);
    } else {
      if (secondaryColor.hex().toLowerCase() != DEFAULT_THEME_COLOR
        .toLowerCase()) {
        this.fontColor = "#fff";
      }

      secondaryColor = secondaryColor.darken(.2);
    }

    this.colors = [
      this.primaryColor,
      secondaryColor.hex().toLowerCase()
    ];
  }
  PrepareBackgrounStyle() {
    this.backgroundStyle = `color: ${this.fontColor} !important;`

    if (this.colors.length < 2) {
      this.backgroundStyle += `background: ${this.colors} !important;`
    } else {
      this.backgroundStyle +=
        `background: linear-gradient(180deg, ${this.colors});`;

      if (this.colors.length > 2) {
        this.backgroundStyle += `
				animation: BackgroundAnimation 6s ease infinite;
				transform: translateZ(0);
				will-change: background-position;
				background-size: 1% 10000%;
				`;
      }
    }
  }
  PrepareStyles() {
    this.styles = `
		@keyframes BackgroundAnimation {
			50% {
				background-position: 0% 100%
			}
		}

		.sg-box--blue,
		.sg-header__container,
    .sg-button--primary-blue,
		.mint-tabs__tab--active,
		#html .mint .mint-header,
		#html .mint #tabs-doj #main_menu>li.active,
		#html .mint #footer{
			${this.backgroundStyle}
		}

    .sg-menu-list__link,
    .sg-text--link.sg-text--blue,
    .sg-text--link.sg-text--blue-dark,
		.sg-link:not([class*="gray"]):not([class*="light"]):not([class*="mustard"]):not([class*="peach"]),
		#html .mint #profile #main-left .personal_info .helped_subjects>li,
		#html .mint #profile #main-left .personal_info .helped_subjects>li .bold,
		#html .mint #profile #main-left .personal_info .helped_subjects>li .bold a,
		#html .mint #profile #main-left .personal_info .helped_subjects>li .green,
		#html .mint .mod-profile-panel a,
		#html .mint .mod-profile-panel .pseudolink,
		#html .mint .mod-profile-panel .orange,
		#html .mint .mod-profile-panel .onlylink,
		div#content-old .editProfileContent .profileListEdit,
		#main-panel .menu-right .menu-element#panel-notifications .notifications-container .notifications li.notification .main .content .nick,
    #main-panel .menu-right .menu-element#panel-notifications .notifications-container .notification-wrapper .main .content .nick,
    #moderate-task-toplayer a:not(.btn-danger) {
			color: ${this.fixedPrimaryColor} !important;
		}

		#html .mint #tabs-doj #main_menu>li.active a{
			color: ${this.fontColor} !important;
		}

    .sg-button--link-button-blue,
		.sg-sticker__front {
			color: ${this.primaryColor} !important;
			fill: ${this.primaryColor} !important;
    }

    .brn-progress-tracking__tab--blue{
      border-color: ${this.primaryColor};
    }
		`
  }
  ChangeStyles() {
    this.styleElement.innerHTML = this.styles;
  }
  UpdateColor(color) {
    this.fontColor = "#333";
    this.primaryColor = color;
    this.fixedPrimaryColor = color;

    this.RenderStyles();
  }
}

export default ThemeColorChanger
