// เราต้องทำอะไรบ้างในการจะเก็บ report 1 ครั้ง
// - เช็ค URL with table WebsiteMeta (ต้องจัดformatURLที่ User ใส่เข้ามาด้วย)
// - ถ้ามีก็ไม่ต้อง Create WebsiteMeta
//   - แต่ check current percent กับ max percent แล้วเก็บเข้า Verification
// - ถ้าไม่มีต้องเก็บเข้าเว็บไซต์ Meta + verification ด้วย [ในกรณีที่ซักประเภท>70%]

import { getWebsiteMetaByURL, setCategoryID, setURL } from "@/app/utils/report/getReportFunc";
import { createMetaWebsite, getVerificationByMetaWebsiteID } from "@/app/utils/verification/getVerificationFunc";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body);
        const session = getServerSession(authOptions);
        const currUserSession = JSON.stringify(session);
        console.log(currUserSession);
        const { UserID, WebsiteURL, WebsiteCategory, BankID, BankAccountOwner, BankNumber, WebsiteReportedDetails, MetaWebsite, CurrentPercent } = body
        // TODO: SetCategoryID
        const webcatID = await setCategoryID(WebsiteCategory);
        console.log("userID: ", UserID);
        console.log("webcatID: ", webcatID);
        console.log("reportDetails: ", WebsiteReportedDetails)
        console.log("Meta: ", MetaWebsite);
        console.log("Percent: ", CurrentPercent);
        // TODO: Call setURL Function to Clean the URL to match the existing URL in WebsiteMeta
        const URL = await setURL(WebsiteURL);
        // TODO: Call getWebsiteMetaByURL function to check existing url in WebsiteMeta
        const websiteMetaArray = await getWebsiteMetaByURL(URL);
        let websiteMeta;
        let webVerification;
        // Result is an array, actually each link must be unique!!
        if (websiteMetaArray.length > 0) {
            // So we can access just the first element
            console.log("Entry state 1: this url have in database")
            websiteMeta = websiteMetaArray[0];
            console.log(websiteMeta.MetaWebsiteID);
            webVerification = await getVerificationByMetaWebsiteID(websiteMeta.MetaWebsiteID, CurrentPercent);
            console.log(webVerification);
        } else {
            console.log("Entry state 2: this url no have in database")
            if (CurrentPercent.gambling > 70 || CurrentPercent.scam > 70 || CurrentPercent.fake > 70) {
                await createMetaWebsite(MetaWebsite, CurrentPercent)
            }
            else {
                console.log("The percent are not pass the threshold");
            }
        }
        // TODO: Create WebsiteDetails [report details]
        console.log("Create Report here!!")
        // const newReport = await db.websiteDetail.create({
        //     data: {
        //         UserID: UserID,
        //         WebCategoryID: Number(webcatID),
        //         WebsiteURL: WebsiteURL,
        //         BankID: BankID,
        //         BankAccountOwner: BankAccountOwner,
        //         BankNumber_: BankNumber,
        //         WebsiteReportedDetails: WebsiteReportedDetails,
        //     }
        // });
        const newReport = await db.websiteDetail.create({
            data: {
                UserID,
                WebCategoryID: Number(webcatID),
                WebsiteURL,
                WebsiteReportedDetails,
            }
        });
        console.log(newReport);
        // return NextResponse.json({ websiteMeta: websiteMetaArray, message: "Find Meta Here" }, { status: 201 });
        return NextResponse.json({ websiteDetail: newReport, message: "Report created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error });
    }
}

// TODO: Create WebsiteDetails [report details]
// const WebsiteStatus = true;
// const newReport = await db.websiteDetail.create({
//     data: {
//         UserID,
//         WebCategoryID,
//         WebsiteURL,
//         BankID,
//         BankAccountOwner,
//         BankNumber_,
//         WebsiteReportedDetails,
//     }
// });