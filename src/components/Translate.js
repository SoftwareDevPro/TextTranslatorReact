import React, { useState, useEffect } from "react";
import { Form, TextArea, Input, Button, Icon } from "semantic-ui-react";
import axios from "axios";

export default function Translate() {
    
  const [inputText, setInputText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [targetLanguage, setTargetLangauge] = useState("");
  const [languagesList, setLanguagesList] = useState([]);
  const [resultText, setResultText] = useState("");

  const getLanguageSource = async () => {
    let response = await axios.post(`https://libretranslate.de/detect`, {
      q: inputText,
    });
    return response.data[0].language;
  };

  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`).then((response) => {
      setLanguagesList(response.data);
    });
  }, []);

  const languageKey = (selectedLanguage) => {
    setTargetLangauge(selectedLanguage.target.value);
  };

  const translateText = async () => {
    let lsource = await getLanguageSource();
    setDetectedLanguage(lsource);

    let data = {
      q: inputText,
      source: lsource,
      target: targetLanguage,
    };

    axios
      .post(`https://libretranslate.de/translate`, data)
      .then((response) => {
        setResultText(response.data.translatedText);
      })
      .catch((error) => {
        setResultText("Unable to translate text");
      });
  };

  return (
    <div>
      <div className="app-header">
        <h2 className="header">Text Translator</h2>
      </div>

      <div className="app-body">
        <div>
          <Form>
            <Form.Field
              control={TextArea}
              placeholder="Type Text to Translate.."
              onChange={(e) => setInputText(e.target.value)}
            />

            <Input
              label="Detected Input Language"
              placeholder="language"
              value={detectedLanguage}
              readOnly
              className="detect-input-language"
            />

            <select className="language-select" onChange={languageKey}>
              <option>Please Select Language..</option>
              {languagesList.map((language) => {
                return (
                  <option value={language.code} key={language.name}>
                    {language.name}
                  </option>
                );
              })}
            </select>

            <Form.Field
              control={TextArea}
              placeholder="Your Result Translation.."
              value={resultText}
            />

            <Button color="blue" size="large" onClick={translateText}>
              <Icon name="translate" />
              Translate
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
