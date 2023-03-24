"use strict";
var core;
(function (core) {
    class Contact {
        m_fullname;
        m_contactnumber;
        m_emailaddress;
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this.m_fullname = fullName;
            this.m_contactnumber = contactNumber;
            this.m_emailaddress = emailAddress;
        }
        set FullName(fullName) {
            this.m_fullname = fullName;
        }
        get FullName() {
            return this.m_fullname;
        }
        set ContactNumber(contactNumber) {
            this.m_contactnumber = contactNumber;
        }
        get ContactNumber() {
            return this.m_contactnumber;
        }
        set EmailAddress(emailAddress) {
            this.m_emailaddress = emailAddress;
        }
        get EmailAddress() {
            return this.m_emailaddress;
        }
        toString() {
            return `FullName:${this.FullName} \n Contact Number:${this.ContactNumber} \n Email Address :${this.EmailAddress} `;
        }
        serialize() {
            if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            }
            console.error("one or more of the contact attribute is empty or missing");
            return null;
        }
        deserialize(data) {
            const propertyArray = data.split(",");
            this.m_fullname = propertyArray[0];
            this.m_contactnumber = propertyArray[1];
            this.m_emailaddress = propertyArray[2];
        }
    }
    core.Contact = Contact;
})(core || (core = {}));
//# sourceMappingURL=contact.js.map