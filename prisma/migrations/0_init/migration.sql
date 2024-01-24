-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "joineddate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastlogin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetail" (
    "UserID" SERIAL NOT NULL,
    "UserName" TEXT NOT NULL,
    "UserEmail" TEXT NOT NULL,
    "UserPhone" TEXT,
    "UserPassword" VARCHAR(60) NOT NULL,
    "UserJoinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserPictureURL" TEXT,
    "UserLastLogin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDetail_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "UserVerifyBox" (
    "UserVerifyID" SERIAL NOT NULL,
    "WebsiteURL" VARCHAR(256) NOT NULL,
    "WebsiteMetaTitle" TEXT,
    "WebsiteMetaDesc" TEXT,
    "WebsiteMetaKeyword" TEXT,
    "WebsiteStatus" BOOLEAN NOT NULL,

    CONSTRAINT "UserVerifyBox_pkey" PRIMARY KEY ("UserVerifyID")
);

-- CreateTable
CREATE TABLE "Verification" (
    "VerificationID" SERIAL NOT NULL,
    "WebsiteID" SERIAL NOT NULL,
    "WhitelistID" SERIAL NOT NULL,
    "UserVerifyID" SERIAL NOT NULL,
    "CGamblingPercentage" INTEGER NOT NULL,
    "CScamPercentage" INTEGER NOT NULL,
    "CFakePercentage" INTEGER NOT NULL,
    "COtherPercentage" INTEGER NOT NULL,
    "CVerifyDate" TIMESTAMPTZ(6) NOT NULL,
    "MGamblingPercentage" INTEGER NOT NULL,
    "MScamPercentage" INTEGER NOT NULL,
    "MFakePercentage" INTEGER NOT NULL,
    "MOtherPercentage" INTEGER NOT NULL,
    "MVerifyDate" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("VerificationID")
);

-- CreateTable
CREATE TABLE "WebsiteCategory" (
    "WebCategoryID" SERIAL NOT NULL,
    "WebCategoryName" VARCHAR(128) NOT NULL,

    CONSTRAINT "WebsiteCategory_pkey" PRIMARY KEY ("WebCategoryID")
);

-- CreateTable
CREATE TABLE "WebsiteDetail" (
    "WebsiteID" SERIAL NOT NULL,
    "UserID" SERIAL NOT NULL,
    "WebCategoryID" SERIAL NOT NULL,
    "WebsiteURL" VARCHAR(256) NOT NULL,
    "WebsiteMetaTitle" TEXT,
    "WebsiteMetaDesc" TEXT,
    "WebsiteMetaKeyword" TEXT,
    "WebsiteText" TEXT,
    "WebsiteStatus" BOOLEAN NOT NULL,
    "WebsiteReportedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "BankAccountName" VARCHAR(128),
    "BankAccountOwner" VARCHAR(128),
    "BankAccountNumber" VARCHAR(50),

    CONSTRAINT "WebsiteDetail_pkey" PRIMARY KEY ("WebsiteID")
);

-- CreateTable
CREATE TABLE "WhitelistWebsite" (
    "WhitelistID" SERIAL NOT NULL,
    "WebsiteID" SERIAL NOT NULL,
    "WhitelistURL" VARCHAR(256) NOT NULL,
    "WhitelistMetaTitle" TEXT,
    "WhitelistMetaDesc" TEXT,
    "WhistlistMetaKeyword" TEXT,
    "WhitelistText" TEXT,

    CONSTRAINT "WhitelistWebsite_pkey" PRIMARY KEY ("WhitelistID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_UserName_key" ON "UserDetail"("UserName");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_UserEmail_key" ON "UserDetail"("UserEmail");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_UserPhone_key" ON "UserDetail"("UserPhone");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_UserPictureURL_key" ON "UserDetail"("UserPictureURL");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "UserVerifyID" FOREIGN KEY ("UserVerifyID") REFERENCES "UserVerifyBox"("UserVerifyID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "WebsiteID" FOREIGN KEY ("WebsiteID") REFERENCES "WebsiteDetail"("WebsiteID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "WhitelistID" FOREIGN KEY ("WhitelistID") REFERENCES "WhitelistWebsite"("WhitelistID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WebsiteDetail" ADD CONSTRAINT "UserID" FOREIGN KEY ("UserID") REFERENCES "UserDetail"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WebsiteDetail" ADD CONSTRAINT "WebCategoryID" FOREIGN KEY ("WebCategoryID") REFERENCES "WebsiteCategory"("WebCategoryID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WhitelistWebsite" ADD CONSTRAINT "WebsiteID" FOREIGN KEY ("WebsiteID") REFERENCES "WebsiteDetail"("WebsiteID") ON DELETE NO ACTION ON UPDATE NO ACTION;

