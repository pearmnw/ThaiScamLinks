"use client";
import { useScopedI18n } from "@/locales/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ReportForm = ({
  url,
  metaWebsite,
  currentPercent,
  verifySuccess,
}: any) => {
  const t = useScopedI18n("report");
  const router = useRouter();
  const userInfo = useSession();

  const [formInput, setFormInput] = useState({
    websitecategory: "",
    websitedetail: "",
    bankaccountowner: "",
    bank: "",
    bankaccnumber: "",
    successMsg: "",
  });

  const [formError, setFormError] = useState({
    websiteurl: "",
    websitecategory: "",
    websitedetail: "",
    bankaccname: "",
    bankaccountowner: "",
    bankaccnumber: "",
  });

  const handleUserInput = (name: string, value: string) => {
    setFormInput({
      ...formInput,
      [name]: value,
    });
  };

  const validateFormInput = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    let hasErrors = false;
    // Initialize an object to track input errors
    let inputError = {
      userID: "",
      websiteurl: "",
      websitecategory: "",
      websitedetail: "",
      bankaccname: "",
      bankaccountowner: "",
      bankaccnumber: "",
    };

    if (!url) {
      setFormError({
        ...inputError,
        websiteurl: "Please provide the url",
      });
      hasErrors = true;
    }

    if (!formInput.websitecategory || formInput.websitecategory == "default") {
      setFormError({
        ...inputError,
        websitecategory: t("webCatError"),
      });
      console.log(formError.websitecategory);
      console.log("Category not provided");
      hasErrors = true;
    }

    if (!formInput.websitedetail) {
      console.log("Website details not provided");
      setFormError({
        ...inputError,
        websitedetail: t("moredetailError"),
      });
      hasErrors = true;
    }

    if (!hasErrors) {
      console.log("formInput:", formInput);
      console.log("formError:", formError);
      console.log(url);
      setFormInput((prevState) => ({
        ...prevState,
        successMsg: "",
      }));
      onSubmit();
    }
  };

  const onSubmit = async () => {
    try {
      console.log("formInput:", formInput);
      console.log("formError:", formError);
      console.log(url);
      console.log(userInfo.data?.user.id);
      console.log(metaWebsite.url);
      console.log(currentPercent);
      console.log(currentPercent.normal);
      // router.push("/report/success");
      const res = await fetch("api/linkreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserID: userInfo.data?.user.id,
          WebsiteURL: url,
          WebsiteCategory: formInput.websitecategory,
          BankID: formInput.bank,
          BankAccountOwner: formInput.bankaccountowner,
          BankNumber: formInput.bankaccnumber,
          WebsiteReportedDetails: formInput.websitedetail,
          MetaWebsite: metaWebsite,
          CurrentPercent: currentPercent,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok && data.websiteDetail) {
        toast.success(data.message);
        router.push("/report/success");
      } else {
        console.log("Report Failed");
        toast.error(data.message);
        setFormInput((prevState) => ({
          ...prevState,
          successMsg: "",
        }));
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (verifySuccess == true) {
    return (
      <>
        <p className="text-[12px] font-[500] text-center text-red-600">
          {formError.websiteurl}
        </p>
        <form onSubmit={validateFormInput}>
          <div className="flex-row px-[17rem] justify-center items-center text-slate-700 text-xl font-semibold tracking-tight">
            <div className="flex pt-5 pb-1">
              {t("Catagory")}&nbsp;
              {":"}
              <div className="px-[1rem]">
                <select
                  title="webcatagory"
                  id="webcatagory"
                  name="websitecategory"
                  value={formInput.websitecategory}
                  onChange={({ target }) => {
                    handleUserInput(target.name, target.value);
                    console.log("Selected value:", target.value);
                    console.log("category:", formInput.websitecategory);
                  }}
                  className="w-[280px] h-11 pl-2 bg-white rounded-lg shadow font-normal text-neutral-500
              text-sm"
                >
                  <option value="default">{t("typefield")}</option>
                  <option value="gambling">{t("gambling")}</option>
                  <option value="scam">{t("scam")}</option>
                  <option value="fake">{t("fake")}</option>
                  <option value="others">{t("others")}</option>
                </select>
              </div>
            </div>
            <p className="text-[12px] font-[500] ml-[16rem] text-red-600">
              {formError.websitecategory}
            </p>

            <div className="flex py-8">
              {t("moredetails")}&nbsp;
              {":"}
              <div className="px-[1rem]">
                <textarea
                  id="message"
                  name="websitedetail"
                  rows={4}
                  value={formInput.websitedetail}
                  onChange={({ target }) => {
                    console.log("Selected value:", target.value);
                    handleUserInput(target.name, target.value);
                    console.log("details:", formInput.websitedetail);
                  }}
                  // required
                  className="block w-[29rem] h-[10rem] p-2 text-sm text-gray-900 bg-white bg-opacity-60 rounded-lg border border-neutral-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("details")}
                ></textarea>
                <p className="text-[12px] font-[500] text-red-600">
                  {formError.websitedetail}
                </p>
              </div>
            </div>

            <div className="flex">
              {t("bankacc")}&nbsp;
              {":"}
              <div className="px-[1rem]">
                <input
                  id="bankaccountowner"
                  name="bankaccountowner"
                  value={formInput.bankaccountowner}
                  onChange={({ target }) => {
                    console.log("Selected value:", target.value);
                    handleUserInput(target.name, target.value);
                  }}
                  className="block w-[25rem] h-[3rem] p-2 text-sm text-gray-900 bg-white bg-opacity-60 rounded-lg border border-neutral-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("banktext")}
                />
              </div>
            </div>

            <div className="flex py-8">
              <select
                title="bank"
                id="bank"
                name="bank"
                value={formInput.bank}
                onChange={({ target }) => {
                  console.log("Selected value:", target.value);
                  handleUserInput(target.name, target.value);
                }}
                className="w-[10.5rem] h-11 pl-2 bg-white rounded-lg shadow font-normal text-neutral-500
              text-sm"
              >
                <option value="default">{t("bank")}</option>
                <option value="scb">{t("scb")}</option>
                <option value="kbtg">{t("kbtg")}</option>
                <option value="ktb">{t("ktb")}</option>
                <option value="ttb">{t("ttb")}</option>
                <option value="boa">{t("boa")}</option>
                <option value="lhb">{t("lhb")}</option>
                <option value="gsb">{t("gsb")}</option>
                <option value="others">{t("bankothers")}</option>
              </select>

              <div className="px-[2rem]">
                <input
                  id="bankaccnumber"
                  name="bankaccnumber"
                  value={formInput.bankaccnumber}
                  onChange={({ target }) => {
                    console.log("Selected value:", target.value);
                    handleUserInput(target.name, target.value);
                  }}
                  className="block w-[25rem] h-[3rem] p-2 text-sm text-gray-900 bg-white bg-opacity-60 rounded-lg border border-neutral-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("banknum")}
                />
              </div>
            </div>
          </div>
          <div className="text-center py-[2.5rem]">
            <button
              className="items-center justify-center text-[16px] mr-2 bg-[#9F9FA4] text-white w-[170px] h-[50px] py-2 px-4 rounded-[50px] inline-flex"
              type="submit"
              id="button-addon3"
              data-te-ripple-init
            >
              {t("reportbutt")}
            </button>
          </div>
        </form>
      </>
    );
  } else {
    return <></>;
  }
};
export default ReportForm;
