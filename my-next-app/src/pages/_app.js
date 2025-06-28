// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  // 如果当前页面定义了 getLayout，就用它包裹页面；否则直接渲染页面
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
