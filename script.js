document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn').addEventListener('click', function(e) {
    // 問題番号
    let qNum = document.getElementById('q_num').value
    // JSコード
    let code = document.getElementById('code').value

    // 入力コードにエラーがある場合はここでキャッチ
    try {
      eval(code)
    } catch {
      return alert('コード内にエラーがあります')
    }

    // 基本的なミスはここでキャッチ
    if (code === '') {
      return alert('コードを入力してください。')
    } else if (code.indexOf('return') === -1) {
      return alert('「return」がないので書きましょう。')
    } else if (code.indexOf('Math.abs') !== -1 && qNum === 'one') {
      return alert('「Math.abs()」を使わずに書きましょう。')
    } 

    // 関数名を取得(try中で宣言すると他で呼び出せない)
    let funcName;
    try {
       funcName = detectFunctionName(code)
    } catch {
      return alert('関数の書き方が間違っています。function命令で書きましょう。')
    }

    // 取れてるか確認
    // console.log(funcName)

    let result = judgeFunction(qNum, funcName, code)
    if (result !== undefined) {
      alert(result)
    }
    // =>正解or不正解

    e.preventDefault()
  })
})

// 関数名を取得する関数
function detectFunctionName(str) {
  // function+１文字以上の空白 の次にある文字列を(の直前まで取得
  // ちなみに関数名と()の間に空白があればそれもキャッチしてしまう
  let funcName = str.match(/(?<=function\s+)[ -~]+(?=\()/)[0]

  // 空白部分を除去
  return funcName.replace(/\s+/g, "");
}

function judgeFunction(qNum, funcName, code) {
  // 各配列の0番目に引数、１番目に期待する値
  let allAnswers = {
    // 絶対値
    one: [ [[1], 1], [[-2], 2], [[0], 0] ],

    // 平均値
    two: [ [[3,4,5], 4], [[-10, 40, 30], 20], [[-20, -18, -22], -20] ],

    // 球の表面積
    three: [ [[5], 314], [[9], 1018], [[17], 3632] ],

    // FizzBuzz
    four: [ [[48], "12の倍数"], [[63], "9の倍数"], [[21], "3の倍数"], [[71], "その他"] ],

    // 連想配列に変換
    five: [ [["name", "Andy"], {name: "Andy"}]],

    // 文字列の繰り返し
    six: [ [["hoge", 4], ['hoge', 'hoge', 'hoge', 'hoge']] ],

    // 計算機
    seven: [ [[6, "+", 4], 10], [[10, "-", 2], 8], [[8, "*", 4], 32], [[9, "*", 2], 4.5], [[4, "hoge", 9], "計算できません"] ],

    // ピラミッド
    eight: [ [[5], 15], [[15], 120], [[893], 399171] ],
  }


  let answers = allAnswers[qNum]

  // 判定
  let judge = true
  for (let i = 0; i < answers.length; i++) {
    // 関数名(引数)の形にして元コードに追加
    code += funcName + '(' + getArgument(answers[i][0]) + ')' + '\n'
    try {
      // JSはオブジェクトの比較がメモリのアドレスでの比較になるので
      // 戻り値がオブジェクト(連想配列)の場合はそれをキャッチして特殊な処理をして比べる
      if (typeof(eval(code)) === 'object') {
        let ansJSON = JSON.stringify(eval(code))
        let expJSON = JSON.stringify(answers[i][1])
        if (ansJSON !== expJSON) {
          judge = false
        }
        break
      } 
      
      // 期待する値が異なる場合、judgeをfalseにしてfor文を抜ける
      if (eval(code) !== answers[i][1]) {
        judge = false
        // console.log(eval(code))
        // console.log(answers[i][1])
        break
      }
    } catch {
      return alert('コードを実行するとエラーが発生します')
    }
  }

  if (judge) {
    return '正解です！おめでとうございます。'
  } else {
    return '関数の実行結果に誤りがあります。'
  }
}

// 引数を取得する関数
function getArgument(answers) {
  let array = []
  for (let j = 0; j < answers.length; j++) {
    // 文字列はこのように明示的にしてあげないと認識してくれない。
    if (typeof(answers[j]) === 'string') {
      array.push("'" + answers[j] + "'")
    } else {
      array.push(answers[j])
    }
  }
  return array.join(',')
}
