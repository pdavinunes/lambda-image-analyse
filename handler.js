"use strict";
const {
  promises: { readFile },
} = require("fs");

class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const names = workingItems.map(({ Name }) => Name).join(" and ");

    return { names, workingItems };
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };

    const { TranslatedText } = await this.translatorSvc
      .translateText(params)
      .promise();

    return TranslatedText.split(" e ");
  }

  formatTextResult(texts, workingItems) {
    const finalText = [];
    console.log("texts", texts);
    console.log("workingItems", workingItems);
    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;

      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      );
    }

    return finalText.join("\n");
  }

  async main(event) {
    try {
      const imgBuffer = await readFile("./images/cat.jpg");
      console.log("Detecting images...");
      const { names, workingItems } = await this.detectImageLabels(imgBuffer);
      console.log("Translating to Portuguese...");
      const texts = await this.translateText(names);
      console.log("Handling final object...");
      const finalText = this.formatTextResult(texts, workingItems);
      console.log("finishing...");

      return {
        statusCode: 200,
        body: `A imagem tem\n `.concat(finalText),
      };
    } catch (error) {
      console.log("**ERROR**", error.stack);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}

//factory
const aws = require("aws-sdk");
const reko = new aws.Rekognition();
const translator = new aws.Translate();
const handler = new Handler({
  rekoSvc: reko,
  translatorSvc: translator,
});

module.exports.main = handler.main.bind(handler);
