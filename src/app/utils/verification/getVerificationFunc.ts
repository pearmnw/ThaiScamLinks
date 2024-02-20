// TODO: Create the useful function with db for the Vefication Page

import { db } from "@/lib/db";

export const getVerificationByMetaWebsiteID = async (metaWebsiteID: any, currentPercent: any) => {
    try {
        const verificationInfo = await db.verification.findUnique({
            where: {
                WebsiteID: metaWebsiteID
            }
        }
        )
        if (verificationInfo) {
            updateCurrentPercent(verificationInfo.WebsiteID, currentPercent);
            const checkMaxGambing = await checkPercent(verificationInfo.MGamblingPercentage, currentPercent.gambling)
            const checkMaxScam = await checkPercent(verificationInfo.MScamPercentage, currentPercent.scam)
            const checkMaxFake = await checkPercent(verificationInfo.MFakePercentage, currentPercent.fake)
            const checkMaxOthers = await checkPercent(verificationInfo.MOtherPercentage, currentPercent.normal)
            if (checkMaxGambing) {
                updateMaxGamblingPercent(verificationInfo.WebsiteID, currentPercent.gambling)
            }
            if (checkMaxScam) {
                updateMaxScamPercent(verificationInfo.WebsiteID, currentPercent.scam)
            }
            if (checkMaxFake) {
                updateMaxFakePercent(verificationInfo.WebsiteID, currentPercent.fake)
            }
            if (checkMaxOthers) {
                updateMaxOtherPercent(verificationInfo.WebsiteID, currentPercent.normal)
            }
            return verificationInfo
        }
        else {
            // Create verification
            const verificationInfo = await createVerification(metaWebsiteID, currentPercent);
            if (verificationInfo) {
                console.log(verificationInfo);
                console.log("Success Create Verification for WebID: ", metaWebsiteID)
            }
            return verificationInfo

        }
    } catch (error) {
        return error;
    }
}

export const checkPercent = async (maxPercent: any, currentPercent: any) => {
    try {
        if (maxPercent && currentPercent) {
            if (currentPercent > maxPercent) {
                return true
            }
            else {
                return false
            }
        }
        else {
            throw Error("No have data in to checkPercent Function")
        }
    } catch (error) {
        return error;
    }
}

export const updateCurrentPercent = async (webID: any, currentPercent: any) => {
    try {
        console.log("Start->updateCurrentPercent");
        const result = await db.verification.update({
            where: {
                WebsiteID: webID
            },
            data: {
                CGamblingPercentage: currentPercent.gambling,
                CScamPercentage: currentPercent.scam,
                CFakePercentage: currentPercent.fake,
                COtherPercentage: currentPercent.normal,
            }
        })
        if (result) {
            console.log(result)
            console.log("Success->updateCurrentPercent");
        }
    } catch (error) {
        return error;
    }
}

export const updateMaxGamblingPercent = async (webID: any, maxPercent: any) => {
    try {
        console.log("Start->updateMaxGamblingPercent");
        const result = await db.verification.update({
            where: {
                WebsiteID: webID
            },
            data: {
                MGamblingPercentage: maxPercent,
            }
        })
        if (result) {
            console.log(result)
            console.log("Success->updateMaxGamblingPercent");
        }
    } catch (error) {
        return error;
    }
}

export const updateMaxScamPercent = async (webID: any, maxPercent: any) => {
    try {
        console.log("Start->updateMaxScamPercent");
        const result = await db.verification.update({
            where: {
                WebsiteID: webID
            },
            data: {
                MScamPercentage: maxPercent,
            }
        })
        if (result) {
            console.log(result)
            console.log("Success->updateMaxScamPercent");
        }
    } catch (error) {
        return error;
    }
}

export const updateMaxFakePercent = async (webID: any, maxPercent: any) => {
    try {
        console.log("Start->updateMaxFakePercent");
        const result = await db.verification.update({
            where: {
                WebsiteID: webID
            },
            data: {
                MFakePercentage: maxPercent,
            }
        })
        if (result) {
            console.log(result)
            console.log("Success->updateMaxFakePercent");
        }
    } catch (error) {
        return error;
    }
}

export const updateMaxOtherPercent = async (webID: any, maxPercent: any) => {
    try {
        console.log("Start->updateMaxOtherPercent");
        const result = await db.verification.update({
            where: {
                WebsiteID: webID
            },
            data: {
                MOtherPercentage: maxPercent,
            }
        })
        if (result) {
            console.log(result)
            console.log("Success->updateMaxOtherPercent");
        }
    } catch (error) {
        return error;
    }
}
// Function for verification part
export const createVerification = async (webID: any, currentPercent: any) => {
    // TODO: we will keep the website only when the some of type's ML percent[Gambling, Scam, Fake] > 70
    try {
        console.log("Start->updateCurrentPercent");
        const result = await db.verification.create({
            data: {
                WebsiteID: webID,
                CGamblingPercentage: currentPercent.gambling,
                CScamPercentage: currentPercent.scam,
                CFakePercentage: currentPercent.fake,
                COtherPercentage: currentPercent.normal,
                MGamblingPercentage: currentPercent.gambling,
                MScamPercentage: currentPercent.scam,
                MFakePercentage: currentPercent.fake,
                MOtherPercentage: currentPercent.normal,
            }
        })
        if (result) {
            console.log(result)
            console.log("Success->updateCurrentPercent");
            return result;
        }
    } catch (error) {
        return error;
    }
}

export const createMetaWebsite = async (metaWebsite: any, currentPercent: any) => {
    // TODO: we will keep the website only when the some of type's ML percent[Gambling, Scam, Fake] > 70
    try {
        console.log("Start->CreateMetaWebsite");
        const webcatID = await setCategoryIDForWebMeta(currentPercent)
        console.log(metaWebsite);
        const result = await db.websiteMeta.create({
            data: {
                WebCategoryID: Number(webcatID),
                WebsiteURL: metaWebsite.url,
                WebsiteMetaTitle: metaWebsite.title[0],
                WebsiteMetaDesc: metaWebsite.description[0],
                WebsiteMetaKeyword: metaWebsite.keyword,
                WebsiteText: metaWebsite.detail,
                WebsiteStatus: metaWebsite.status,
            }
        })
        if (result) {
            console.log(result)
            console.log("Success->CreateMetaWebsite");
            const VerificationCreate = await createVerification(result.MetaWebsiteID, currentPercent)
            console.log("Verification: ", VerificationCreate)
            return VerificationCreate;
        }
    } catch (error) {
        return error;
    }
}

export const createUserVerifyBox = async (metaWebsite: any, currentPercent: any) => {
    // TODO: we will keep the website only when the some of type's ML percent[Gambling, Scam, Fake] > 70
    try {
        console.log("Start->createUserVerifyBox");
        const webcatID = await setCategoryIDForWebMeta(currentPercent)
        console.log(metaWebsite);
        const result = await db.userVerifyBox.create({
            data: {
                WebsiteURL: metaWebsite.url,
                WebsiteMetaTitle: metaWebsite.title[0],
                WebsiteMetaDesc: metaWebsite.description[0],
                WebsiteMetaKeyword: metaWebsite.keyword,
                WebsiteStatus: metaWebsite.status,
            }
        })
        if (result) {

            console.log(result)
            console.log("Success->createUserVerifyBox");
            return result;
        }
    } catch (error) {
        return error;
    }
}

export const setCategoryIDForWebMeta = async (currentPercent: any) => {
    try {
        let WebCategoryID;
        // ถ้า Fake กับ gambling or scam มีค่าเท่ากันเก็บอันไหน? ทำไม?
        const maxpercent = Math.max(Number(currentPercent.gambling), Number(currentPercent.scam), Number(currentPercent.fake))
        console.log("Start set Category Here!")
        console.log("Maxpercent: ", maxpercent);
        console.log("maxpercenttostring: ", maxpercent.toString())
        switch (maxpercent.toString()) {
            case currentPercent.gambling.toString():
                WebCategoryID = 1
                break;
            case currentPercent.scam.toString():
                WebCategoryID = 2
                break;
            case currentPercent.fake.toString():
                WebCategoryID = 3
                break;
            default:
                throw Error("No Maxpercent")
        }
        return WebCategoryID;
    } catch (error) {
        console.log(error);
    }
}