/* eslint-disable vars-on-top */
/* eslint-disable no-useless-escape */
import { api, LightningElement, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import EMAIL from "@salesforce/schema/Case.OYP_Email__c";
import TYPE_FIELD from "@salesforce/schema/Case.Type";
import PHONE from "@salesforce/schema/Case.OYP_Phone__c";
import GIVENNAME from "@salesforce/schema/Case.OYP_Given_Name_s__c";
import SURNAME from "@salesforce/schema/Case.OYP_Surname__c";
import POSTCODE from "@salesforce/schema/Case.OYP_Post_Code__c";
import REASON from "@salesforce/schema/Case.OYP_Reason_For_Call__c";
import DATE from "@salesforce/schema/Case.OYP_Schedule_Call_Date__c";
import TIME from "@salesforce/schema/Case.OYP_Time_for_scheduled_call__c";
import getContactFormRecordTypeId from "@salesforce/apex/OYPUtil.getContactFormRecordTypeId";
import createFeddbackCaseMethod from "@salesforce/apex/OYPContactFormController.createFeddbackCaseMethod";

export default class OypContactFormComponent extends LightningElement {
  @track InputOne = EMAIL;
  @track InputTwo = PHONE;
  @track InputFour = GIVENNAME;
  @track InputFive = SURNAME;
  @track InputSix = POSTCODE;
  @track InputSeven = REASON;
  @track Date = DATE;
  @track Time = TIME;
  @track isLoading = false;
  @track DisplayText = true;
  @track DisplayEnd = false;
  @track SelectInputOne = "slds-hide";
  @track SelectInputTwo = "slds-hide";
  @track currentDate = this.returnCurrentDate();
  @track CaseType = TYPE_FIELD;

  @api csColumnImage1 = "/sfsites/c/resource/oypAssets/crisis/life.png";
  @api csColumnUrl1 = "https://www.lifeline.org.au/";
  @api csColumnImage2 = "/sfsites/c/resource/oypAssets/crisis/sane.png";
  @api csColumnUrl2 = "https://www.sane.org/";
  @api csColumnImage3 = "/sfsites/c/resource/oypAssets/crisis/suicide.png";
  @api csColumnUrl3 = "https://www.suicidecallbackservice.org.au/";
  @api csColumnImage4 = "/sfsites/c/resource/oypAssets/crisis/blue.png";
  @api csColumnUrl4 = "https://www.beyondblue.org.au/";
  @api csColumnImage5 = "/sfsites/c/resource/oypAssets/crisis/kids.png";
  @api csColumnUrl5 = "https://kidshelpline.com.au/";
  @api csColumnImage6 = "/sfsites/c/resource/oypAssets/crisis/health.png";
  @api csColumnUrl6 = "https://health.act.gov.au/";
  reminderText = "MindMap is not a crisis service, for crisis support, please contact:"

  @wire(getContactFormRecordTypeId)
  recordtype;
  CaseObj = {
    Origin: "Community",
    Status: "New",
    Type: "Request a Call",
    OYP_Email__c: "",
    OYP_Phone__c: "",
    OYP_Given_Name_s__c: "",
    OYP_Surname__c: "",
    OYP_Post_Code__c: "",
    OYP_Schedule_Call_Date__c: "",
    OYP_Time_for_scheduled_call__c: "",
    OYP_Reason_For_Call__c: "",
    RecordTypeId: ""
  };

  CheckEmailValidity(value) {
    var input = this.template.querySelector(".email");
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value.match(emailRegex)) {
      input.setCustomValidity("");
    } else {
      input.setCustomValidity("Enter valid Email");
    }
    input.reportValidity();
  }

  handleChange(event) {
    const inputName = event.target.name;
    if (inputName === "input1") {
      this.CaseObj.OYP_Email__c = event.detail.value;
    } else if (inputName === "input2") {
      this.CaseObj.OYP_Phone__c = event.detail.value;
      this.checkPhoneValidity(this.CaseObj.OYP_Phone__c);
    } else if (inputName === "inputDate") {
      this.CaseObj.OYP_Schedule_Call_Date__c = event.detail.value;
      this.checkDateValidity();
    } else if (inputName === "inputTime") {
      this.CaseObj.OYP_Time_for_scheduled_call__c = event.detail.value;
      this.checkTimeValidity();
    } else if (inputName === "input4") {
      this.CaseObj.OYP_Given_Name_s__c = event.detail.value;
      this.SelectRadioFour = "slds-hide";
    } else if (inputName === "input5") {
      this.CaseObj.OYP_Surname__c = event.detail.value;
      this.SelectRadioFour = "slds-hide";
    } else if (inputName === "input6") {
      this.CaseObj.OYP_Post_Code__c = event.detail.value;
      this.SelectRadioFour = "slds-hide";
    } else if (inputName === "input7") {
      this.CaseObj.OYP_Reason_For_Call__c = event.detail.value;
      this.SelectRadioFour = "slds-hide";
    }
  }
  returnCurrentDate() {
    var currentdate = new Date();

    var datetime =
      currentdate.getFullYear() +
      "-" +
      String(currentdate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(currentdate.getDate()).padStart(2, "0");

    return datetime;
  }

  checkDateValidity() {
    var input = this.template.querySelector(".date");
    
    if (input.validity.rangeUnderflow === false && input.validity.badInput === false) {
      input.setCustomValidity("");
      input.reportValidity();
      return true;
    }
    input.setCustomValidity("You must select a Preferred Date in the future.");
    input.reportValidity();
    return false;
  }
  checkTimeValidity() {
    var input = this.template.querySelector(".time");
    if (input.validity.rangeUnderflow === false && input.validity.badInput === false && input.validity.rangeOverflow === false) {
      input.setCustomValidity("");
      input.reportValidity();
      return true;
    }
    input.setCustomValidity("You must select a Preferred Time in the future.");
    input.reportValidity();
    return false;
  }
  checkEmailValidity() {
    var input = this.template.querySelector(".email");
    //console.log("Email Pattern==",input.validity.typeMismatch);
    if (input.validity.typeMismatch===false) {
      input.setCustomValidity("");
      input.reportValidity();
      return true;
    }
    input.setCustomValidity("Please provide a valid email.");
    input.reportValidity();
    return false;
  }
  
  checkPhoneValidity(inputtxt) {
    if(inputtxt === undefined){
      var inputphoneUnde = this.template.querySelector(".phone");
      inputphoneUnde.setCustomValidity("Please provide a valid phone number.");
      inputphoneUnde.reportValidity();
      return false;
    }
    var phoneno = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
   //console.log(inputtxt);
    if(inputtxt.match(phoneno)) {
      var inputforphone = this.template.querySelector(".phone");
      inputforphone.setCustomValidity("");
      inputforphone.reportValidity();
      return true;
    }
      var inputphone = this.template.querySelector(".phone");
      inputphone.setCustomValidity("Please provide a valid phone number.");
      inputphone.reportValidity();
      return false;
     
  }
  checkPostCodeValidity(){
    var Postcode = this.template.querySelector(".postcode");
    if (Postcode.validity.patternMismatch === false && Postcode.validity.rangeOverflow === false) {
      Postcode.setCustomValidity("");
      Postcode.reportValidity();
      return true;
    }
      Postcode.setCustomValidity("Please provide a valid postcode.");
      Postcode.reportValidity();
    return false;
  }
  caseSubmitHandler() {
    this.isLoading = true;
    this.CaseObj.RecordTypeId = this.recordtype.data;
    if (
      this.CaseObj.OYP_Phone__c === "" ||
      this.CaseObj.OYP_Phone__c === null ||
      this.checkPhoneValidity(this.CaseObj.OYP_Phone__c)===false
    ) {
      this.isLoading = false;
      //console.log("entered");
      var inputphone = this.template.querySelector(".phone");
      inputphone.setCustomValidity("Please provide a valid phone number.");
      inputphone.reportValidity();
    } else if (this.CaseObj.OYP_Phone__c !== "" &&  this.checkPhoneValidity(this.CaseObj.OYP_Phone__c)) {
      //console.log("exited"+this.checkPhoneValidity()+this.CaseObj.OYP_Phone__c);
      var inputphn = this.template.querySelector(".phone");
      inputphn.setCustomValidity("");
        this.isLoading = true;
          }
    if (
      this.CaseObj.OYP_Schedule_Call_Date__c === "" ||
      this.CaseObj.OYP_Schedule_Call_Date__c === null ||
      this.checkDateValidity() === false
    ) {
      this.isLoading = false;
      //console.log("Date=="+this.checkDateValidity());
      var input = this.template.querySelector(".date");
      input.setCustomValidity("You must select a Preferred Date in the future.");
      input.reportValidity();
    }
    if (
      this.CaseObj.OYP_Time_for_scheduled_call__c === "" ||
      this.CaseObj.OYP_Time_for_scheduled_call__c === null ||
      this.checkTimeValidity() === false
    ) {
      this.isLoading = false;
      //console.log("Time=="+this.checkDateValidity());
      var inputtime = this.template.querySelector(".time");
      inputtime.setCustomValidity("You must select a Preferred Time in the future.");
      inputtime.reportValidity();
    }
    if(this.CaseObj.OYP_Email__c !== ""){
      if(this.checkEmailValidity()=== false){
        this.isLoading = false;
      }
    }
    if(this.CaseObj.OYP_Post_Code__c !== ""){
      if(this.checkPostCodeValidity()=== false){
        this.isLoading = false;
      }
    }
    

    if (this.isLoading === false) {
      return;
    }
    //Check reCaptcha
    this.template.querySelector("c-oyp-recaptcha").validate();
  }
  handlerecaptchaverified(event) {
    if (event.detail.verifed) {
      // console.log("reCaptcha valid");
      // console.log(event.detail);
      createFeddbackCaseMethod({ FeedbackCaseCreation: this.CaseObj })
        .then((result) => {
            if(result=== 'success'){
                //console.log("Result",result);
              this.message = result;
              this.error = undefined;
              this.isLoading = false;
              if (this.message !== undefined) {
                this.dispatchEvent(
                  new ShowToastEvent({
                    title: "Your request has been submitted.",
                    message: this.message,
                    variant: "success"
                  })
                );
              }
              this.DisplayText = false;
              this.DisplayEnd = true;
              }else{
                this.error = result;
              //console.log("error", JSON.stringify(this.error));
              this.isLoading = false;
              this.message = undefined;
    
              this.dispatchEvent(
                new ShowToastEvent({
                  title: "Error While Submitting Your Feedback!",
                  message: "Error",
                  variant: "error"
                })
              );
            }
        })
        .catch((error) => {
          this.error = error;
          //console.log("error", JSON.stringify(this.error));
          this.isLoading = false;
          this.message = undefined;

          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error While Submitting Your Feedback!",
              message: "Please check your Email & Phonenumber.",
              variant: "error"
            })
          );
        });
    } else {
      //console.log("reCaptcha Failed");
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error While Submitting Your Feedback!",
          message: "Please complete reCaptcha verification.",
          variant: "error"
        })
      );
    }
  }
}