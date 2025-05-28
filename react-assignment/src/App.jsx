import SearchBar from "./components/SearchBar";

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
  <h1
    style={{
      fontSize: '1.875rem',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: '2.5rem',
      color: '#3b82f6',  
    }}
  >
    SearchPro
  </h1>
  <SearchBar />
</div>
  );
}

export default App;