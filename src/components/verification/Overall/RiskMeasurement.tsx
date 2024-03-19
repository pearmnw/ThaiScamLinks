"use client";
import { useScopedI18n } from "@/locales/client";
import Link from "next/link";
import { useContext } from "react";
import { VerificationContext } from "../Verification";

const RiskMeasurement = () => {
  const t = useScopedI18n("verificationpage");
  const {
    maxCategoryReport,
    highestVerifyOverall,
    maliciousUrlOverall,
    hasAnotherDatabase,
    riskScoreOverall,
  } = useContext(VerificationContext).overviewScore;

  const getColor = (score: number) => {
    if (score >= 1 && score <= 25) {
      return "#04CE00";
    } else if (score > 25 && score <= 50) {
      return "#F2CC6B";
    } else if (score > 50 && score <= 75) {
      return "#F97316";
    } else if (score > 75) {
      return "#B51A36";
    } else {
      return "#ccc";
    }
  };

  const getColorReportCount = (score: number) => {
    if (score >= 0 && score <= 5) {
      return "#04CE00";
    } else if (score > 5 && score <= 10) {
      return "#F2CC6B";
    } else if (score > 10 && score <= 15) {
      return "#F97316";
    } else if (score > 15) {
      return "#B51A36";
    } else {
      return "#ccc";
    }
  };

  const getResultReportCount = () => {
    if (
      maxCategoryReport &&
      maxCategoryReport._type !== "other" &&
      maxCategoryReport._count
    ) {
      return (
        <div className="flex flex-col gap-1">
          {maxCategoryReport._count} {t("report-unit")}
          <p className="text-sm font-medium">
            *{t("report-most")} "{t(maxCategoryReport._type)}"
          </p>
        </div>
      );
    } else if (
      maxCategoryReport &&
      !maxCategoryReport._count &&
      !maxCategoryReport._type
    ) {
      return <p className="text-4xl">{t("NOT FOUND")}</p>;
    } else if (
      (maxCategoryReport._count && maxCategoryReport._type === "other") ||
      riskScoreOverall !== 0
    ) {
      return (
        <div className="flex flex-col gap-1">
          {maxCategoryReport._count} {t("report-unit")}
          <p className="text-sm font-medium">
            *{t("report-most")} "{t(maxCategoryReport._type)}"
          </p>
        </div>
      );
    } else {
      return (
        <p className="text-4xl" style={{ color: "#ccc" }}>
          {t("NOT FOUND")}
        </p>
      );
    }
  };

  const getResultHighestVerify = () => {
    if (highestVerifyOverall && highestVerifyOverall._count) {
      return (
        <div
          className="flex flex-col gap-1"
          style={
            highestVerifyOverall._type === "other" ? { color: "#04CE00" } : {}
          }
        >
          {highestVerifyOverall._count} %
          <p className="text-sm font-medium">
            *{t("analysis-most")} "{t(highestVerifyOverall._type)}"
          </p>
        </div>
      );
    } else {
      return (
        <p className="text-4xl" style={{ color: "#ccc" }}>
          {t("NOT FOUND")}
        </p>
      );
    }
  };

  const getApiDatabaseResult = () => {
    const isFoundStatus = hasAnotherDatabase.some(
      (db: any) => db.status === t("FOUND")
    );
    return isFoundStatus;
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-3 p-4">
        <h4 className="text-2xl font-semibold text-custom-black">
          {t("risk-measurement-citeria")}
        </h4>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-3 w-full">
          <div className="border-2 border-custom-black rounded-lg shadow-md bg-white w-2/4 h-56 py-3 px-5 flex flex-col justify-between">
            <p className="text-custom-black font-medium text-lg h-2/6 min-h-20">
              {t("found-thai-scam-link")}
            </p>
            <div
              className="text-center text-5xl font-bold"
              style={{ color: getColorReportCount(maxCategoryReport._count) }}
            >
              {getResultReportCount()}
            </div>
            <div className="text-right underline font-medium">
              <Link href="#myReport">{t("seemore")}</Link>
            </div>
          </div>
          <div className="border-2  border-custom-black rounded-lg shadow-xl bg-white w-2/4 h-56 py-3 px-5 flex flex-col justify-between">
            <p className="text-custom-black font-medium text-lg h-2/6 min-h-20">
              {t("found-ai")}
            </p>
            <div
              className="text-center text-5xl font-bold"
              style={{
                color: getColor(highestVerifyOverall._count),
              }}
            >
              {getResultHighestVerify()}
            </div>
            <div className="text-right underline font-medium">
              <Link href="#myAI">{t("seemore")}</Link>
            </div>
          </div>
          <div className="border-2 border-custom-black rounded-lg shadow-xl bg-white w-2/4 h-56 py-3 px-5 flex flex-col justify-between">
            <p className="text-custom-black font-medium text-lg h-2/6 min-h-20">
              {t("url-measure")}
            </p>
            <div
              className="text-center text-5xl font-bold"
              style={{ color: getColor(maliciousUrlOverall) }}
            >
              <div className="flex flex-col gap-1">{maliciousUrlOverall} %</div>
            </div>
            <div className="text-right underline font-medium">
              <Link href="#myURL">{t("seemore")}</Link>
            </div>
          </div>
          <div className="border-2 border-custom-black rounded-lg shadow-xl bg-white w-2/4 h-56 py-3 px-5 flex flex-col justify-between">
            <p className="text-custom-black font-medium text-lg h-2/6 min-h-20 ">
              {t("found-other-database")}
            </p>
            <div
              className="text-center text-4xl font-bold"
              style={
                getApiDatabaseResult()
                  ? { color: "#B51A36" }
                  : maliciousUrlOverall === 0
                  ? { color: "#ccc" }
                  : { color: "#04CE00" }
              }
            >
              {getApiDatabaseResult() ? t("FOUND") : t("NOT FOUND")}
            </div>
            <div className="text-right underline font-medium">
              <Link href="#myAPI">{t("seemore")}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMeasurement;
