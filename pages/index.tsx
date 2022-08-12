import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import puppeteer from "puppeteer";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import Head from "next/head";
import axios from "axios";
import styles from "./index.module.css";
import "bootstrap/dist/css/bootstrap.css";

// import { MetaData } from "../components/meta-deta/MetaData";

export default function Home() {
  const [searchedURL, setSearchedURL] = useState("");
  const [isloading,setLoading] = useState(false)
  const [linkDetails,setLinkDetails]=useState<any>(null)
  const [error,setError]=useState<any>(null)

  const getMetaData=async(url:string)=>{
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("/api/getMetaData", { url: url });
      console.log(res.data)
      setLinkDetails(res?.data?.metaData);
      setLoading(false)
    } catch (error:any) {
      setError(error.message)
      setLoading(false);
    }
  }


  return (
    <div>
      <Head>
        <title>Image Preview</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.main}>
        <section className={styles["description-section"]}>
          <div>
            <span className="hightlight-text" style={{ fontSize: "3rem" }}>
              Image Preview
            </span>

            <p className="text-lead my-2">
              Get Site &#39; Meta-details including
              Domain,Title,Description,Image
            </p>
          </div>
        </section>

        <section className={`${styles["demo-section"]}`}>
          <div
            className={`${styles.playarea} ${styles["bg-gray-700/30"]} border border-violet-200/10 w-full rounded-2xl xl:text-lg`}
          >
            <div className={styles["tabs-header"]}>
              <span>Live Demo</span>
            </div>

            <div className={styles["tabs-content"]}>
              <form>
                <label>
                  <span>url</span>
                  <input
                    name="domain_url"
                    value={searchedURL}
                    onChange={(e) => setSearchedURL(e.target.value)}
                    placeholder="Enter site-url, that you wanna see preview"
                    className={"ant-input"}
                  />
                </label>
              </form>
            </div>

            <div className={styles["tabs-footer"]}>
              <button
                disabled={!searchedURL || isloading}
                className="ant-btn"
                // size="large"
                onClick={() => {
                  getMetaData(searchedURL);
                }}
              >
                {!isloading ? "Get Data" : "Fetching Info... "}
              </button>
            </div>
          </div>
        </section>

        <section className={styles.LinkPreview}>
          {linkDetails && !isloading && (
            <div className="per-card-3">
              <div className="card-image d-flex align-items-center flex-row">
                <div className="w-40">
                  <img src={linkDetails?.img} />
                </div>
                <div className="per-name w-60">{linkDetails?.title}</div>
              </div>

              <div className="card-content">
                <span className="per-position">{linkDetails?.domain}</span>
                <div className="card-text">
                  <span>{linkDetails?.description}</span>
                </div>
              </div>
            </div>
          )}
          {isloading && <span className={styles.loader}></span>}
          {!isloading && error && searchedURL && (
            <span className="error">Something went wrong!</span>
          )}
        </section>
      </div>
    </div>
  );
}
