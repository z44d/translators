## About this package

- <strong>Translators</strong> package is supported by 4 Translate engines.
- Translate ( [translate.com](https://www.translate.com/translator) )
- Google ( [translate.google.com](https://translate.google.com/) )
- Hozory ( [hozory.com](https://hozory.com/FA) )
- Translatedict ( [translatedict.com](https://www.translatedict.com/) )

## Usage

> [!NOTE] This project is made for training\educational reason.

### Import

```ts
import Engine from "https://deno.land/x/translators/mod.ts";
```

## Example

```ts
async function main() {
  const engine = new Engine();

  const translateResult = await engine.google.translate(
    "Hola, mi amor",
    "ar",
  );

  const detectResult = await engine.tr.detect(
    "Hola",
  );

  console.log(translateResult);
  console.log(detectResult);
}

main();
```

## LICENSE
- MIT