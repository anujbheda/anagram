package index

import (
    "log"
    "bufio"
    "os"
    "sort"
    "strings"
    "net/http"
    "html/template"
    "encoding/json"
)

var (
    sortedWordMap = make(map[string] []string)
    wordArray []string
    indexTemplate = template.Must(template.ParseFiles("private/index.html"))
)

func init() {
    log.Println("init")
    setupHandler()
    buildDictionary()
}

func setupHandler() {
    http.HandleFunc("/", indexHandler)
    http.HandleFunc("/api", apiHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
    err := indexTemplate.Execute(w, "")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query().Get("query")
    split := strings.Split(query, "")
    sort.Strings(split)
    query = strings.Join(split, "")

    l := sortedWordMap[query]
    if l == nil {
        l = make([]string, 0)
    }

    m := make(map[string] []string)
    m["l"] = l

    js, err := json.Marshal(m)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.Write(js)
}

func buildDictionary() {
    file, err := os.Open("private/words")

    if err != nil {
        panic(err)
    }

    defer file.Close()

    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        wordArray = append(wordArray, scanner.Text())
    }

    for _, word := range wordArray {
        split := strings.Split(word, "")
        sort.Strings(split)
        string := strings.Join(split, "")
        sortedWordMap[string] = append(sortedWordMap[string], word)
    }
}