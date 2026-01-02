Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```


## Setting up Neon

When running the `dev` command, the `@neondatabase/vite-plugin-postgres` will identify there is not a database setup. It will then create and seed a claimable database.

It is the same process as [Neon Launchpad](https://neon.new).

> [!IMPORTANT]  
> Claimable databases expire in 72 hours.


## Setting up WorkOS

- Set the `VITE_WORKOS_CLIENT_ID` in your `.env.local`.



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# ブログアプリ学習プラン

このプロジェクトを使って、TanStack Startでブログアプリを作成しながら学習できます。以下の推奨学習順序に従って、段階的に機能を実装していきましょう。

## 推奨学習順序

### レッスン1-2: 基本構造とデータベーススキーマ
**目標**: ファイルベースルーティングとデータベース設計を理解する

1. **ルーティング構造の作成**
   - `/posts` - 記事一覧ページ
   - `/posts/$postId` - 記事詳細ページ
   - `/posts/new` - 新規記事作成ページ

2. **データベーススキーマの設計**
   - `posts`テーブルの作成（タイトル、本文、著者情報、作成日時、更新日時）
   - `pnpm db:push`でスキーマを適用

**学習内容:**
- `createFileRoute`の使い方
- 動的ルート（`$postId`）
- Drizzle ORMのスキーマ定義

---

### レッスン3: Server Functions基礎
**目標**: `createServerFn`でデータ取得を実装

1. **記事一覧を取得するServer Function**
   - GETメソッドで記事一覧を取得
   - データベースクエリの実行

**学習内容:**
- `createServerFn`の基本
- データベースクエリ
- 型安全性

**実装例:**
```typescript
const getPosts = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
  })
})
```

---

### レッスン4: LoadersとSSR
**目標**: ルートローダーでデータを事前取得

1. **Loaderで記事データを取得**
   - `loader`関数の実装
   - `useLoaderData`でデータ取得

**学習内容:**
- `loader`の使い方
- `useLoaderData`フック
- SSRの動作原理

**実装例:**
```typescript
export const Route = createFileRoute('/posts')({
  loader: async () => await getPosts(),
  component: PostsList,
})

function PostsList() {
  const posts = Route.useLoaderData()
  // ...
}
```

---

### レッスン5: 動的ルートと詳細ページ
**目標**: 個別記事ページの実装

1. **記事詳細ページの実装**
   - `/posts/$postId`で記事詳細を表示
   - 動的ルートパラメータの取得

**学習内容:**
- 動的ルートパラメータ（`useParams`）
- 個別データ取得
- エラーハンドリング（記事が見つからない場合）

---

### レッスン6: フォームとServer Functions（POST）+ Zod導入
**目標**: 記事作成機能とバリデーション

1. **新規記事作成フォーム**
   - フォームUIの実装
   - POST Server Functionの実装

2. **Zodによるバリデーション**
   - バリデーションスキーマの定義
   - `inputValidator`での検証

**学習内容:**
- `inputValidator`でのバリデーション
- POST Server Function
- フォーム送信とリダイレクト
- Zodスキーマの定義

**実装例:**
```typescript
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string()
    .min(1, 'タイトルは必須です')
    .max(200, 'タイトルは200文字以内で入力してください'),
  content: z.string()
    .min(1, '本文は必須です')
    .max(10000, '本文は10000文字以内で入力してください'),
})

const createPost = createServerFn({
  method: 'POST',
})
  .inputValidator(createPostSchema)
  .handler(async ({ data }) => {
    return await db.insert(posts).values(data)
  })
```

---

### レッスン7: 認証統合
**目標**: WorkOSと連携して認証機能を追加

1. **認証保護された機能**
   - 記事作成を認証ユーザーのみに制限
   - 著者情報の保存

**学習内容:**
- `useAuth`フック（WorkOS）
- 認証状態の確認
- 保護されたルート
- ユーザー情報の取得

---

### レッスン8: 編集・削除機能
**目標**: CRUD操作の完成

1. **記事編集・削除機能**
   - PUT/DELETE Server Functions
   - オプティミスティック更新

**学習内容:**
- PUT/DELETE Server Functions
- `router.invalidate()`での再取得
- オプティミスティック更新
- 権限チェック（自分の記事のみ編集可能）

---

### レッスン9: 検索とフィルタリング
**目標**: 高度なデータ操作

1. **記事検索機能**
   - クエリパラメータの扱い
   - データベース検索

**学習内容:**
- クエリパラメータ（`useSearch`）
- データベース検索（LIKE、全文検索）
- クライアント側フィルタリング

---

### レッスン10: ストリーミングと最適化
**目標**: パフォーマンス最適化

1. **ストリーミングSSR**
   - プログレッシブレンダリング
   - コード分割

**学習内容:**
- ストリーミングSSR
- コード分割
- キャッシング戦略
- パフォーマンス最適化

---

## 学習の進め方

1. **各レッスンを順番に実装**
   - レッスン1-2から始めて、順番に進めていきましょう
   - 各レッスンで1つの機能を学びます

2. **既存のデモコードを参考に**
   - `src/routes/demo/`フォルダ内のサンプルコードを参考にできます
   - 特に`drizzle.tsx`、`prisma.tsx`、`start.server-funcs.tsx`が役立ちます

3. **データベース操作**
   - Drizzle ORMを使用（`src/db/index.ts`）
   - スキーマ変更後は`pnpm db:push`で適用

4. **Zodの使用**
   - レッスン6以降でZodを導入してバリデーションを強化
   - `src/lib/validations.ts`にスキーマを定義することを推奨

## 参考リソース

- [TanStack Start ドキュメント](https://tanstack.com/start)
- [TanStack Router ドキュメント](https://tanstack.com/router)
- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)
- [Zod ドキュメント](https://zod.dev/)

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
