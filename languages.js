const languages = [
  ["AR", "Arabic"],
  ["BG", "Bulgarian"],
  ["CS", "Czech"],
  ["DA", "Danish"],
  ["DE", "German"],
  ["EL", "Greek"],
  ["EN-GB", "English (British)"],
  ["EN-US", "English (American)"],
  ["ES", "Spanish"],
  ["ET", "Estonian"],
  ["FI", "Finnish"],
  ["FR", "French"],
  ["HU", "Hungarian"],
  ["ID", "Indonesian"],
  ["IT", "Italian"],
  ["JA", "Japanese"],
  ["KO", "Korean"],
  ["LT", "Lithuanian"],
  ["LV", "Latvian"],
  ["NB", "Norwegian (Bokmål)"],
  ["NL", "Dutch"],
  ["PL", "Polish"],
  ["PT-BR", "Portuguese (Brazilian)"],
  ["PT-PT", "Portuguese"],
  ["RO", "Romanian"],
  ["RU", "Russian"],
  ["SK", "Slovak"],
  ["SL", "Slovenian"],
  ["SV", "Swedish"],
  ["TR", "Turkish"],
  ["UK", "Ukrainian"],
  ["ZH", "Chinese (simplified)"]
];

const languages_to = document.getElementById("languages_to");
const languages_from = document.getElementById("languages_from");

const populateSelect = (element) =>
  languages.forEach((language) => {
    const [code, name] = language;
    const option = document.createElement("option");
    option.value = code;
    option.text = name;
    if (code === "EN-US" && element.id === "languages_from") {
      option.selected = true;
    }

    element.appendChild(option);
  });
populateSelect(languages_to);
populateSelect(languages_from);
