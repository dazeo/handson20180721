# 3-1 D3.jsの基本 select, append, attr

## D3.jsとは

描きたい図形が複雑になればなるほど、一つ一つの図形をプログラムで打ち込んでいくことは非現実的になります。

そこで、登場するのが「__D3.js__」です。
D3.jsは、JavaScriptのライブラリであり、誰もが自由に利用することができます。
「D3」の意味は、Data-Driven Documentsのことであり、データを扱ってWEB上に表現することに特化した機能を備えています。
特に、SVGの描画やアニメーションを扱うことに長けています。

D3.jsを使えば、2-2の棒グラフのような複雑な図形についても、複雑な計算をせずに比較的簡単に描くことができるようになります。

D3.jsは、残念ながらデータを入れればすぐグラフができるという類のものではありません。
しかし、コツさえ掴んでしまえば、どんなものでも描けてしまいます。

![image](http://www.ei-ic.sakura.ne.jp/handson20180721/img/3-1_01.png)  
[D3.js](https://d3js.org/)
<br>

なお、D3.jsは2016年6月28日に、version3からversion4に移行しました（現行はversion5）。
その際に仕様が超大幅変更になり、それまでに作成したスクリプトは軒並み動かないという状況に陥りました。

それだけでなく、D3.jsについて書かれた書籍はほぼ全てv3での記載となっており、現在D3.jsは独学で学びづらい環境にあります。  

## D3.jsの導入

D3.jsは、htmlの'<head>'タグ内に以下のコードを書くだけで、導入ができます。

```html
<script src="https://d3js.org/d3.v5.min.js"></script>
```

これで、JavaScriptなどにスクリプトを書く際に、D3.jsで用意している様々なメソッドを使用することができるようになります。
なお、古いバージョンを読み込みたいときは、上記のv5をv3などに変更します。

## 基本操作 select, append, attr

ここからは、JavaScriptとD3.jsを使用して、HTML内の要素を動的に変更していきます。
D3を使えば、SVGを簡単に扱えます。まず、基本的な操作であるselect, append, attrについて解説します。

index.html
```html
<body>
  <svg id="myGraph"></svg>
  <script src="main.js"></script>
</body>
```

main.js
```js
d3.select("#myGraph")
  .append("rect")
  .attr("width", 40)
  .attr("height", 60)
```

selectは、HTML内の要素を検索して、条件に合致する要素を一つだけ選択するメソッドです。
上記スクリプトでは、IDがmyGraphである要素（上記の場合SVG）を取得して返します。（#はIDを意味します。）

次のappendでは、selectで選択した要素の下に、新しい要素を追加します。ここではrectが追加されます。その後、追加された要素を次のメソッドに渡します。

そして、attrでは受け取った要素の属性情報を変更します。ここでは、widthを40pxに、heightを60pxに変更しています。

このように、D3.jsを使えば、HTML内の要素を後から簡単に書き換えることができます。つまり、ユーザーの反応に応じて様々に変化するものが作れるということです。  
  

## 基本操作 data, enter

例えば、複数の矩形を描く際に、widthやheightをそれぞれのデータに応じた値に設定したいという場合があるでしょう。そのときに使うのがdataメソッドとenterメソッドです。

これらのメソッドは、次のように組み合わせて使用します。

main.js
```js
myData = [35, 38, 16]

d3.select("#myGraph")
  .selectAll(dummy)
  .data(myData)
  .enter()
  .append("rect")
  .attr("width", 40)
  .attr("height", function(d, i){
    return d;
  })
```

このくだりは、ややトリッキーでわかりづらいため、最初はそういうものだと割り切ってください。

簡単に言うと、dataメソッドとenterメソッドを使用して、myDataという配列の35、38、16という3つの値を読み込んで、3つのrectを新規に追加し、さらにそれぞれのrectのheightを値に応じて変化させる処理を行っています。

