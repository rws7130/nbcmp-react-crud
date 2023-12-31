import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Header(props) {
  return <header>
    <h1><a href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lis = [ ]
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read'+t.id} onClick={event=>{
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
    }}>{t.title}</a>
    </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Create(props) {
  return <article>    
    <h2>글 작성</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title,body)
    }}>
      <p>제목</p>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p>내용</p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="작성 완료"/></p>     
    </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>    
    <h2>글 수정</h2> 
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title,body)
    }}>
      <p>제목</p>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p>
      <p>내용</p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="수정 완료"/></p>     
    </form>
  </article>
}



function App() {

  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);

  const [topics,setTopics] = useState([
    {id:1, title:'Apple', body:'사과'},
    {id:2, title:'Banana', body:'맛있다'}
  ]);

  let content = null;
  let contextControl = null;

  if(mode==="WELCOME"){
    content = <Article title="Welcome" body="Hello, web"></Article>
    contextControl = <>
      <a class="btn" href="/create" onClick={event => {
        event.preventDefault();
        setMode('CREATE');
      }}>글 작성</a>
    </>
  }
  else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <a class="btn" href="/create" onClick={event => {
        event.preventDefault();
        setMode('CREATE');
      }}>글 작성</a>
      <a class="btn" href={'/update/' + id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>글 수정</a>
      <input class="btn" type="button" value="글 삭제" onClick={() => {
        const newTopics = []
        for (let i = 0; i < topics.length; i++) {
          if (topics[i].id !== id) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} />
    </>
  }
  else if (mode === 'CREATE') {
    content = <Create onCreate={(_title,_body)=>{
      const newTopic = {id:nextId, title:_title,body:_body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }
  else if (mode === 'UPDATE') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title,body)=>{
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0;i<newTopics.length;i++){
        if(newTopics[i].id===id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');

    }}></Update>    
  }

  return (
    <>
      <Header title="React 게시판 구현" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>

      <div class="background">
        <div class="titlebar">글 목록</div>
        <div class="content">

          <Nav topics={topics} onChangeMode={(_id) => {
            setMode('READ');
            setId(_id);
          }}></Nav>
        </div>

        <div class="titlebar">글 내용</div>
        <div class="content">
          {content}
            <div class="btncover">
              {contextControl}
            </div>
        </div>

      </div>
    </>
  );
}

export default App;