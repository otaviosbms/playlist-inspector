export function formatPrompt(prompt: string, tracks): string{
    prompt = prompt.replace('{tracks}', tracks);

    console.log(prompt)
    return prompt
}