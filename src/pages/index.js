import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import CommentIcon from "@mui/icons-material/Comment";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { ref } from "firebase/database";
import { getDatabase, get } from "firebase/database";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Signout from "../pages/components/signout";
import Linkify from "react-linkify";
import Image from "next/image";
import UserIcon from "@mui/icons-material/QuestionAnswer";
import BotIcon from "@mui/icons-material/SmartToy";
import DownloadIcon from "@mui/icons-material/Download";
import { resolve } from "styled-jsx/css";

require("dotenv").config();

function Home() {
  const text = `I am Cod robot, I'm here to assist you`;
  const [showLetters, setShowLetters] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [contact, setContact] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);
  const [showRound, setShowRound] = useState(false);
  const [searchingGoogle, setSearchingGoogle] = useState(false);
  const [questionDatabase, setQuestionDatabase] = useState("");
  const [responseDatabase, setResponseDatabase] = useState("");

  /**= ==========FUNCTION TO DOWNLOAD THE ANDRIOD APPLICATION=========== =*/

  /**= =================END=========== =*/

  //FUNCTION TO MAKE PUSH REQUEST TO THE DATABASE
  // const handleDatabaseSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check if both questionDatabase and responseDatabase have values
  //   if (!questionDatabase || !responseDatabase) {
  //     console.error("Both question and response are required");
  //     return;
  //   }

  //   try {
  //     // Push the data to the database
  //     const dbRef = ref(getDatabase(), "questionsAndResponses");
  //     await push(dbRef, {
  //       question: questionDatabase,
  //       response: responseDatabase,
  //     });

  //     // Clear the input fields after successful submission
  //     setQuestionDatabase("");
  //     setResponseDatabase("");

  //   } catch (error) {
  //     console.error("Error pushing data to the database:", error);
  //   }
  // };

  /*============FETCHING THE DATA(QUESTIONS AND RESPONSES) FROM THE DB==== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = getDatabase();

        const response = await get(ref(dbRef, "questionsAndResponses"));
        const data = response.val();

        if (data && typeof data === "object") {
          const dataArray = Object.values(data);
          setFetchedData(dataArray);
        } else {
          setFetchedData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchedData([]);
      }
    };
    fetchData();
  });
  /**=============END OF FETCHING DATA FROM DB================== */

  /**==============FUNCTION FOR THE TYPING EFFECT AT THE HEADER======= */
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLetters((prev) => (prev + 1) % text.length);
    }, 200);
    return () => clearInterval(interval);
  }, [text]);
  /**=============END OF THE TYPING EFFECT================ */

  /**============FUNCTIONS THAT HANDLES THE SUBMITION OF THE USER QUESTION */
  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim().length < 3) return;

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { question: userInput, isUser: true },
    ]);
    setUserInput("");
    setQuestionCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      getBotResponse(userInput);
    }, 100);
  };

  useEffect(() => {
    if (questionCount === 3) {
      setShowFeedback(true);
    }
  }, [questionCount]);

  const handleWhatsAppClick = () => {
    const phoneNumber = "+233597063145";
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobileDevice) {
      window.location.href = `whatsapp://send?phone=${phoneNumber}`;
    } else {
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    }
  };

  /**===============END OF THE FUNCTION THAT HANDLES THE SUBMISSION ========= */

  /**===========FUNCTIONS THAT HELPS IN GENERATION OF THE BOT RESPONSES===== */
  const getBotResponse = async (question) => {
    try {
      if (fetchedData) {
        // Function to normalize words by removing common stop words and converting to lowercase
        const normalizeWords = (input) => {
          const removedWords = [
            "at",
            "the",
            "a",
            "as",
            "and",
            "is",
            "are",
            "of",
            "in",
            "on",
            "to",
            "an",
            "up",
            "go",
            "be",
            "we",
            "or",
            "by",
            "he",
            "so",
            "ok",
            "if",
            "us",
            "my",
            "me",
            "not",
            "un",
            "ex",
            "so",
            "if",
            "do",
            "by",
            "oh",
            "yo",
            "!",
            ".",
            ",",
            "'",
            "?",
            ":",
            ";",
            "and",
            "what",
            "for",
            "at",
            "by",
            "for",
            "from",
            "in",
            "off",
            "on",
            "out",
            "over",
            "per",
            "to",
            "up",
            "as",
            "but",
            "down",
            "far",
            "his",
            "its",
            "it's",
            "nor",
            "out",
            "she",
            "too",
            "via",
            "off",

            "all",
            "any",
            "top",
            "low",
            "too",
            "but",
            "and",
            "yet",
          ]; // Add more stop words if needed
          return input
            .toLowerCase()
            .split(" ")
            .filter((word) => !removedWords.includes(word))
            .join(" ");
        };

        // Normalize the user input and fetched data questions
        const normalizedUserInput = normalizeWords(question.toLowerCase());
        const normalizedFetchedQuestions = fetchedData.map((data) =>
          normalizeWords(data.question.toLowerCase())
        );

        // Find all matched responses
        const matchedResponses = fetchedData.reduce((matched, data, index) => {
          const matchingWords = normalizedUserInput
            .split(" ")
            .filter((word) => normalizedFetchedQuestions[index].includes(word));
          if (matchingWords.length >= 2) {
            matched.push({
              response: data.response,
              matchingWords: matchingWords.length,
            });
          }
          return matched;
        }, []);

        // Sort the matched responses in descending order based on the number of matching words
        matchedResponses.sort((a, b) => b.matchingWords - a.matchingWords);

        // If there is a matched response, use it as the bot's response
        if (matchedResponses.length > 0) {
          const botResponse = matchedResponses[0].response;
          for (let i = 0; i < botResponse; i++) {
            await new Promise((resolve) => setTimeout(resolve, 5));

            setChatHistory((prevChatHistory) => [
              ...prevChatHistory,
              {
                question: botResponse.slice(0, i),
                isUser: false,
              },
            ]);
          }
          return; // Exit the function early if a matched response is found
        } else {
          setSearchingGoogle(true);

          setTimeout(() => {
            setSearchingGoogle(false);
          }, 2000);
        }
      }

      const myAPIKey = "AIzaSyCuXxCASqoK4NLnmr7J78HIwEZC9CHMk2U";
      const customSearchEngineId = "151cf42b9aa594d6d";
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${myAPIKey}&cx=${customSearchEngineId}&q=${question}&num=3`
      );

      const normalizedUserInput = question.toLowerCase();
      if (
        normalizedUserInput.includes("kstu") ||
        normalizedUserInput.includes("kumasi technical university")
      ) {
        if (response.ok) {
          setSearchingGoogle(false);
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const userWords = normalizedUserInput.split(" ");
            const filteredResults = data.items.filter((item) => {
              const title = item.title.toLowerCase();
              const snippet = item.snippet.toLowerCase();
              return (
                userWords.some((word) => title.includes(word)) ||
                userWords.some((word) => snippet.includes(word))
              );
            });

            if (filteredResults.length >= 0) {
              const formattedSearchResults = filteredResults.map((result) => ({
                title: result.title,
                snippet: result.snippet,
                link: result.link,
              }));

              setChatHistory((prevChatHistory) => [
                ...prevChatHistory,
                {
                  question: "Here are some relevant search results:",
                  isUser: false,
                },
                ...formattedSearchResults.map((result) => ({
                  question: `${result.title}\n${result.snippet}\n${result.link}`,
                  isUser: false,
                })),
              ]);
            } else {
              setChatHistory((prevChatHistory) => [
                ...prevChatHistory,
                {
                  question:
                    "I'm sorry, I couldn't find any relevant information for your query.",
                  isUser: false,
                },
              ]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        {
          question: "I'm sorry, there was an error. Please try again.",
          isUser: false,
        },
      ]);
    }
  };

  /**===================END OF THE FUNCTION THAT HELPS IN GENERATING RESPONSE */

  useEffect(() => {
    setShowRound(true);
    const timer = setTimeout(() => {
      setShowRound(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* <div className={styles.pushToDatabase}>
        <form onSubmit={handleDatabaseSubmit}>
          <input
            value={questionDatabase}
            placeholder="Question to push to database"
            onChange={(e) => setQuestionDatabase(e.target.value)}
          />
          <input
            value={responseDatabase}
            placeholder="Response to push database"
            onChange={(e) => setResponseDatabase(e.target.value)}
          />

          <button type="submit">Push To Databse</button>
        </form>
      </div> */}

      {showRound && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <h1 className={styles.please1}>You are Welcome </h1>
        </div>
      )}

      {searchingGoogle && (
        <div className={styles.loadingGoogle}>
          <div className={styles.loadingSpinnerGoogle}></div>
          <h1 className={styles.pleaseGoogle}>Codrobot searching... </h1>
        </div>
      )}

      <div className={styles.chatbotContainer}>
        <div className={styles.chatBotHeader}>
          <div className={styles.leftSide}>
            <div className={styles.logoContainer}>
              <Image
                src="/codLogo.jpg"
                width={100}
                height={100}
                alt="logo"
                className={styles.logoImg}
              />
              <div className={styles.titles}>
                <h1>Cod Robot</h1>
                <h1>{text.substr(0, showLetters)}</h1>
              </div>
            </div>
            <div className={styles.rightSide}>
              <div
                className={styles.CloseIcon}
                onClick={() => setContact(true)}
              >
                <CommentIcon className={styles.icon} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.theChats}>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={chat.isUser ? styles.userQuestion : styles.botResponse}
            >
              {chat.isUser ? (
                <>
                  <UserIcon className={styles.icon1} />
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        href={decoratedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={key}
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    <p>{chat.question}</p>
                  </Linkify>
                </>
              ) : (
                <>
                  <BotIcon className={styles.icon2} />
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        href={decoratedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={key}
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    <p>{chat.question}</p>
                  </Linkify>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.userInput}>
        <form onSubmit={handleUserSubmit}>
          <input
            type="text"
            placeholder="Keep on asking me"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
          <button
            type="submit"
            disabled={userInput.trim().length < 3}
            className={userInput.trim().length < 3 ? styles.disabledButton : ""}
          >
            ASK
          </button>
        </form>
      </div>

      {contact && (
        <div className={styles.contactContainer}>
          <div className={styles.contactIcons}>
            <a href="https://wa.me/233597063145">
              <div className="whatsAppIcon">
                <WhatsAppIcon />
              </div>
            </a>

            <a href="https://www.linkedin.com/in/aksakyi/">
              <div className={styles.LinkedInIcon}>
                <LinkedInIcon />
              </div>
            </a>

            <a
              href="https://www.webintoapp.com/download/zip/145269/Cod%20Robot%201.0.zip?9Op922q9oqZP"
              download
            >
              <div className={styles.emailIcon}>
                <DownloadIcon /> APP
              </div>
            </a>

            <div className={styles.callIcon}>
              <Signout />
            </div>

            <div className={styles.closeIcon} onClick={() => setContact(false)}>
              <span>&times;</span>
            </div>
          </div>
        </div>
      )}

      {showFeedback && (
        <div className={styles.feedbackPopup}>
          <div className={styles.feedbackIcon}>
            <h2 onClick={() => setShowFeedback(false)}>&times; close</h2>
            <h1>How was your experience with Cod Robot?</h1>
            <FeedbackIcon className={styles.img} />
            <button onClick={handleWhatsAppClick}>Click</button>
          </div>
        </div>
      )}

      {showWelcomeMessage && (
        <div className={styles.showWelcomeMessageContainer}>
          <div className={styles.welcomeMessage}>
            <h1>
              Hello, I am Cod Robot, I am delighted to have you here. Do not
              hesitate to ask questions related to Kumasi Technical University
            </h1>
          </div>
          <div className={styles.closeWelcomeMessage}>
            <button onClick={() => setShowWelcomeMessage(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
