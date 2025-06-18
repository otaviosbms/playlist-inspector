export function formatPrompt(prompt: string, tracks: any): string{
    prompt = prompt.replace('{tracks}', tracks);

    console.log(prompt)
    return prompt
}