package main

import (
    "strconv"
    "fmt"
  "reflect"
)

func main() {
    t := strconv.Itoa(123)
    fmt.Println(t)
  	fmt.Println(reflect.TypeOf(t))
}
