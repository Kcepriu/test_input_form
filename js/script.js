class FormInputData {
  constructor(className = "input-form") {
    //Find elements form
    this.createInitialData(className);

    //VAlidation element form
    if (!this.isValidationElementsForm()) {
      console.log("Error markcup");
      return;
    }

    //add events button
    this.addEventsForm();
  }

  // * Service function

  createInitialData(className) {
    this.arrayString = [];
    this.rootElem = document.querySelector(`.${className}`);

    this.inputField = this.rootElem.querySelector(`.input-form__input`);
    this.outputField = this.rootElem.querySelector(`.input-form__output`);

    this.allBtns = this.findBtns(this.rootElem);
  }

  findBtns(rootElem) {
    const btns = {};
    btns.add = rootElem.querySelector('[data-action="add"]');
    btns.delete = rootElem.querySelector('[data-action="delete"]');
    btns.showXML = rootElem.querySelector('[data-action="show_xml"]');
    btns.sortByName = rootElem.querySelector('[data-action="sort_by_name"]');
    btns.sortByValue = rootElem.querySelector('[data-action="sort_by_value"]');

    return btns;
  }

  addEventsForm() {
    this.allBtns.add.addEventListener("click", this.onClickAdd.bind(this));
    this.allBtns.delete.addEventListener(
      "click",
      this.onClickDelete.bind(this)
    );
    this.allBtns.showXML.addEventListener(
      "click",
      this.onClickShowXML.bind(this)
    );
    this.allBtns.sortByName.addEventListener(
      "click",
      this.onClickSortByName.bind(this)
    );
    this.allBtns.sortByValue.addEventListener(
      "click",
      this.onClickSortByValue.bind(this)
    );

    this.rootElem.addEventListener("submit", this.onSubmit.bind(this));
  }

  getNewElem(nameElement, valueElement) {
    return { nameElement, valueElement };
  }

  // * HAndlers Events
  onClickAdd() {
    if (this.addToArrayString(this.inputField.value))
      this.inputField.value = "";
  }

  onClickDelete() {
    this.deleteRowFromArrayString(this.numberActiveString(this.outputField));
  }

  onClickShowXML() {
    //TODO Реалізувати
    console.log("Click Show XML");

    const xmlStr = this.toXml(this.arrayString);
    console.log(xmlStr);
    const myWindow = window.open("", "XML", "width=500,height=300");
    // myWindow.document.open("content-type: text/xml;charset=UTF-8");
    myWindow.document.open("text/xml");
    myWindow.document.write(xmlStr);

    console.dir(myWindow.document);
  }

  onClickSortByName() {
    this.sortByName();
    this.refreshOutputFields();
  }

  onClickSortByValue() {
    this.sortByValue();
    this.refreshOutputFields();
  }

  onSubmit(event) {
    // disable submit
    event.preventDefault();

    this.onClickAdd();
  }

  // * VAlidations
  isValidationElementsForm() {
    return true;
  }

  isValidationInputData(inputData) {
    const re = /^[A-Za-z0-9 _\t]+=[A-Za-z0-9 _\t]+$/;

    return re.test(inputData);
  }

  // * work with Data
  addToArrayString(inputData) {
    if (!this.isValidationInputData(inputData)) {
      this.showErrorValidationData();
      return false;
    }

    const newElement = this.getNewElem(...this.parsingInputData(inputData));

    this.arrayString.push(newElement);

    this.inputDataInOutput(newElement, this.outputField);

    return true;
  }

  deleteRowFromArrayString(numberString) {
    this.arrayString.splice(numberString - 1, 1);
    //TODO deletetfrom UI
    this.refreshOutputFields();
  }

  sortByName() {
    this.arrayString.sort((a, b) => a.nameElement.localeCompare(b.nameElement));
  }
  sortByValue() {
    this.arrayString.sort((a, b) =>
      a.valueElement.localeCompare(b.valueElement)
    );
  }

  parsingInputData(inputData) {
    const [name, value] = inputData.split("=");

    return [name.trim(), value.trim()];
  }

  showErrorValidationData() {
    //TODO Write real send message
    // alert("Error validation input data");
  }

  inputDataInOutput(element, field) {
    field.value += (field.value ? "\n" : "") + this.elementToStr(element);
  }

  elementToStr(element) {
    return element.nameElement + "=" + element.valueElement;
  }

  numberActiveString(element) {
    return element.value.substr(0, element.selectionStart).split("\n").length;
  }

  refreshOutputFields() {
    const newStr = { value: "" };
    this.arrayString.forEach((element) => {
      this.inputDataInOutput(element, newStr);
    });

    this.outputField.value = newStr.value;
  }

  toXml(object) {
    const propArray = "list";
    const promElem = "elem";

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += `\n<${propArray}> \n`;
    object.forEach((elem) => {
      xml += `<${promElem} name="${elem.nameElement}">${elem.valueElement}`;
      xml += `<\\${promElem}> \n`;
    });
    xml += `<\\${propArray}> `;

    return xml;
  }
}

const form = new FormInputData();
