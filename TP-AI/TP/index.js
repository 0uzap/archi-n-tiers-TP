require("dotenv").config();

async function queryModelWithFetch(inputText) {
  //const MODEL_NAME = "samLowe/roberta-base-go_emotions";
  const MODEL_NAME ="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: inputText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function main() {
  try {
    // Using Fetch
    const response = await queryModelWithFetch(
      //"i love myself but at the same time i hate myself more than anyone else, i'm my biggest hater"
      "donne umoi une blague "
    );
    console.log("Response:", response);
  } catch (error) {
    console.error("Main Error:", error);
  }
}

main();
