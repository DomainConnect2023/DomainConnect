export interface NotificationData {
    logID: string;
    textValue: string;
    base64Image: string;
    imgUrl: string;
    qrText: string;
    createdTime: string;
    // other properties
}

export type InsertUserData = {
    insert: string,
    username: string,
    password: string,
    companyName: string,
    vihecleNo: string,
    email: string,
    mobile: string,
    mobileValue: string,
    mobileCountry: string,
    birthDate: any,
    [key: string]: string;
};

export type UpdateUserData = {
    update: string,
    userID: string,
    username: string,
    companyName: string,
    vihecleNo: string,
    email: string,
    mobile: string,
    mobileValue: string,
    mobileCountry: string,
    birthDate: any,
    // [key: string]: string;
};