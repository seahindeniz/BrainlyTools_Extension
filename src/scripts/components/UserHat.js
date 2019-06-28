const HATS = {
  list: [{
      file: `/images/hats/hat_0.svg`,
      css: "top: -8px;left: 15px;transform: rotate(-28deg);"
    },
    {
      file: `/images/hats/hat_1.svg`,
      css: "top: -10px;left: 37px;transform: rotate(-7deg);"
    },
    {
      file: `/images/hats/hat_2.svg`,
      css: "top: -6px; transform: rotate(-26deg); "
    },
    {
      file: `/images/hats/hat_3.svg`,
      css: "width: 44px;top: -9px;left: 21px;"
    },
    {
      file: `/images/hats/hat_4.svg`,
      css: "top: -8px;left: 75px;transform: rotate(25deg);"
    },
    {
      file: `/images/hats/hat_5.svg`,
      css: ""
    },
    {
      file: `/images/hats/hat_6.svg`,
      css: "top: -6px;left: 40px;width: 65px;transform: rotate(-7deg);"
    },
    {
      file: `/images/hats/hat_7.svg`,
      css: "top: -2px; left:33px;width: 50px;transform: rotate(26deg);"
    },
    {
      file: `/images/hats/hat_8.svg`,
      css: "top: -12px; left: 16px; width: 70px; transform: rotate(5deg);"
    },
    {
      file: `/images/hats/hat_9.png`,
      css: "top: -25px; left: 30px; width: 70px; transform: rotate(-6deg);"
    },
    {
      file: `/images/hats/hat_10.png`,
      css: "top: -18px;width: 70px;transform: rotate(24deg);"
    },
    {
      file: `/images/hats/hat_11.png`,
      css: "top: 0;width: 70px;left: 55px;transform: rotate(0deg);"
    },
    {
      file: `/images/hats/hat_12.png`,
      css: "top: -33px;left: 27px;transform: rotate(-8deg);width: 70px;"
    },
  ],
  Unisex: [0, 8, 9],
  get Female() {
    return [1, 2, 4, ...this.Unisex]
  },
  get Male() {
    return [3, 5, 6, 7, ...this.Unisex]
  }
}

function UserHat(gender) {
  gender = gender == 1 ? "Female" : gender == 2 ? "Male" : "Unisex";
  let rn = System.randomNumber(0, HATS[gender].length - 1);
  let hat = HATS.list[HATS[gender][rn]];

  let $userHat = $(`<img src="${System.data.meta.extension.URL + hat.file}" class="userHat" style="${hat.css}">`);

  return $userHat
}

export default UserHat
