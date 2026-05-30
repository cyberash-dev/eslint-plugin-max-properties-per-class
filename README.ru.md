# eslint-plugin-max-properties-per-class

[English](README.md) | **Русский**

Два правила ESLint, ограничивающие количество **методов** и **свойств**, которые
может объявить класс или интерфейс. Работает с классами JavaScript, классами
TypeScript и интерфейсами TypeScript (класс и реализуемый им интерфейс считаются
одинаково). Только flat config ESLint 9.

- `max-properties-per-class/max-methods` — ограничивает методы.
- `max-properties-per-class/max-properties` — ограничивает свойства.

Каждое объявление считается по **собственному** телу, поэтому вложенный класс
учитывается независимо от класса, в который он вложен. Конструктор не считается
никогда.

## Установка

```sh
npm install --save-dev eslint-plugin-max-properties-per-class
```

`eslint` (>=9) — peer-зависимость.

## Использование

Подключите плагин во flat config и включите правила:

```js
// eslint.config.mjs
import cyberash from "eslint-plugin-max-properties-per-class";

export default [
	{
		plugins: { "max-properties-per-class": cyberash },
		rules: {
			"max-properties-per-class/max-methods": ["error", { max: 10 }],
			"max-properties-per-class/max-properties": ["error", { max: 15 }],
		},
	},
];
```

Либо используйте встроенный конфиг `recommended`, который включает оба правила
на уровне `error` с приведёнными выше значениями по умолчанию:

```js
import cyberash from "eslint-plugin-max-properties-per-class";

export default [cyberash.configs.recommended];
```

## Опции

Каждое правило принимает либо число-сокращение, либо объект опций:

```js
"max-properties-per-class/max-methods": ["error", 10]
"max-properties-per-class/max-methods": ["error", { max: 10, includePrivate: true }]
```

| Опция | Тип | По умолчанию | Правила | Значение |
|---|---|---|---|---|
| `max` | целое | 10 (методы) / 15 (свойства) | оба | Максимально допустимое количество. |
| `includePrivate` | boolean | `false` | оба | Учитывать `private` / `#`-приватные члены в лимите. |
| `includeStatic` | boolean | `false` | оба | Учитывать `static`-члены в лимите. |
| `includeProtected` | boolean | `false` | только `max-methods` | Учитывать `protected`-методы в лимите. |

По умолчанию приватные и статические члены исключаются; член учитывается, только
если проходит все активные фильтры. **Асимметрия:** `includeProtected` есть
только у `max-methods`. У `max-properties` такой опции нет, поэтому защищённые
свойства считаются всегда.

У интерфейсов нет модификаторов видимости и `static`, поэтому эти фильтры там
ничего не делают: каждый член интерфейса всегда считается.

## Что считается методом, а что свойством

### Класс

| Объявление | Считается как |
|---|---|
| `foo() {}` | метод |
| `constructor() {}` | ничего (не считается никогда) |
| `get x()` / `set x()` (один ключ) | одно свойство |
| `abstract foo()` | метод |
| `foo = () => {}` / `foo = function () {}` | метод |
| `foo = 0` (поле не-функция) | свойство |
| `abstract foo: T` | свойство |
| `accessor foo = 0` | свойство |
| `constructor(private foo: T)` (parameter property) | свойство |
| индексная сигнатура, статический блок | ничего |

### Интерфейс

| Объявление | Считается как |
|---|---|
| `foo(): void` | метод |
| `foo: () => void` (тип-функция) | метод |
| `foo: T` (прочее) | свойство |
| `(): void` (call signature) | метод |
| `new (): T` (construct signature) | ничего |
| индексная сигнатура | ничего |

### Примечания

- **Перегрузки схлопываются.** Несколько сигнатур метода с одним ключом
  (перегрузки методов TS, перегрузки методов интерфейса, повторяющиеся call
  signature) считаются как одна.
- **Вычисляемые ключи.** Нелитеральный вычисляемый ключ (`[Symbol.iterator]()`,
  `[expr]()`) считается отдельным и никогда не схлопывается с другим членом.
