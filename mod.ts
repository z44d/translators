export interface GoogleResult {
  text: string;
  originalLanguage: string;
}

export interface HozoryResult {
  text: string;
  voiceLink: string;
}

const defaultHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36",
};

function generateParams(params: Record<string, string>): string {
  const parameters = new URLSearchParams(
    params,
  ).toString();
  return parameters;
}

async function googleTranslate(
  text: string,
  tl?: string,
  sl?: string,
): Promise<GoogleResult> {
  const params = generateParams({
    client: "at",
    sl: sl ?? "auto",
    tl: tl ?? "en",
    q: text,
  });
  const response = await fetch(
    `https://clients5.google.com/translate_a/t?${params}`,
    {
      headers: defaultHeaders,
      method: "GET",
    },
  );
  if (!response.ok) {
    throw new Error(`Not Found ${response.status}`);
  }
  const result: Array<string> = (await response.json())[0];
  return {
    text: result[0],
    originalLanguage: result[result.length - 1],
  };
}

async function hozoryTranslate(
  text: string,
  target?: string,
): Promise<HozoryResult> {
  const params = generateParams(
    {
      text: text,
      target: target ?? "en",
    },
  );
  const response = await fetch(
    `https://hozory.com/translate/?${params}`,
    {
      headers: defaultHeaders,
      method: "GET",
    },
  );
  if (!response.ok) {
    throw new Error(`Not Found ${response.status}`);
  }
  const result: Record<string, string> = await response.json();

  if (result.status === "ok") {
    return {
      text: result.translate,
      voiceLink: result.voice_link,
    };
  } else throw new Error(JSON.stringify(result));
}

async function tdictTranslate(text: string, tl?: string): Promise<string> {
  const params = generateParams(
    {
      p1: "auto",
      p2: tl ?? "en",
      p3: text,
    },
  );
  const response = await fetch(
    `https://t3.translatedict.com/1.php?${params}`,
    {
      headers: defaultHeaders,
      method: "GET",
    },
  );
  return await response.text();
}

async function trTranslate(
  text: string,
  tl?: string,
  sl?: string,
): Promise<string> {
  const response = await fetch(
    "https://www.translate.com/translator/ajax_translate",
    {
      method: "POST",
      body: new URLSearchParams({
        text_to_translate: text,
        translated_lang: tl ?? "en",
        source_lang: sl ?? (await trDetect(text)),
        use_cache_only: "false",
      }),
      headers: defaultHeaders,
    },
  );
  const result: Record<string, string> = await response.json();

  return result.translated_text;
}

async function trDetect(text: string): Promise<string> {
  const response = await fetch(
    "https://www.translate.com/translator/ajax_lang_auto_detect",
    {
      method: "POST",
      body: new URLSearchParams(
        { text_to_translate: text },
      ),
      headers: defaultHeaders,
    },
  );

  const result: Record<string, string> = await response.json();

  return result.language;
}

export default class Engine {
  google = {
    translate: googleTranslate,
  };
  hozory = {
    translate: hozoryTranslate,
  };
  tdict = {
    translate: tdictTranslate,
  };
  tr = {
    translate: trTranslate,
    detect: trDetect,
  };
}
