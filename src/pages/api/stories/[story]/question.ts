import { getStory } from '@/models/getStory';
import type { NextApiHandler } from 'next'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler : NextApiHandler = async (req, res) => {
    if(!(typeof req.query.story === "string")){
        throw new Error("Invalid query")
    };
    const story = await getStory(req.query.story);
    const body = JSON.parse(req.body);
    const prompt = `
    『${story.coreDescription}
    ${story.additionalDescription || ""}』
    『』内の物語について質問するので、その質問に「はい」か「いいえ」、もしくは物語から読み取れないことは「答えられない」で答えてください。
    ${body.debugMode ? "その理由も答えてください。" :  "「はい」「いいえ」「答えられない」以外に余計なことは言わないでください。"}
    Q:${body.prompt}
    A:`
    await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    }).then(e => {
        res.status(200).json({answer:e.data.choices[0].text})
    }).catch(() => {
        res.status(500).json({error: "OpenAI API Error"})
    })
}

export default handler
