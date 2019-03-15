
package main

import (
	"fmt"
	

	"bytes"
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("Document Management Logs")

type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Document Management Init ###########")
	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### example_cc0 Invoke ###########")

	function, args := stub.GetFunctionAndParameters()

	if function == "delete" {
		// Deletes an entity from its state
		return t.delete(stub, args)
	}

	if function == "query" {
		// queries an entity state
		return t.query(stub, args)
	}
	if function == "move" {
		// Deletes an entity from its state
		return t.move(stub, args)
	}

	if function == "getHistoryForDocumnent" {

		//get all the versions of a document
		return t.getHistoryForDocumnent(stub, args)
	}

	if function == "upload" {

		//upload a document
		return t.upload(stub, args)
	}

	if function == "queryDocumentByOwner" {
		return t.queryDocumentByOwner(stub, args)
	}

	if function == "downloadDocument" {
		return t.downloadDocument(stub, args)
	}
	logger.Errorf("Unknown action, check the first argument, must be one of 'delete', 'query', or 'move'. But got: %v", args[0])
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'delete', 'query', or 'move'. But got: %v", args[0]))
}

func (t *SimpleChaincode) move(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	

	// Write the state back to the ledger
	err := stub.PutState("A", []byte("init"))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// Deletes an entity from state
func (t *SimpleChaincode) delete(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	A := args[0]

	// Delete the key from the state in ledger
	err := stub.DelState(A)
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	return shim.Success(nil)
}

// Query callback representing the query of a chaincode
func (t *SimpleChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var A string // Entities
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	A = args[0]

	// Get the state from the ledger
	Avalbytes, err := stub.GetState(A)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + A + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + A + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"Name\":\"" + A + "\",\"Amount\":\"" + string(Avalbytes) + "\"}"
	logger.Infof("Query Response:%s\n", jsonResp)
	return shim.Success(Avalbytes)
}

type Document struct {
	ObjectType  string `json:"docType"`  //docType is used to distinguish the various types of objects in state database
	FileName    string `json:"filename"` //the fieldtags are needed to keep case from bouncing around
	Timestamp   string `json:"timestamp"`
	Author      string `json:"author"`
	Hash        string `json:"hash"`
	Mimetype    string `json:"mimetype"`
	Path        string `json:"path"`
	OrginalName string `json:"orginalname"`
	Version     string `json:"version"`
}

func (t *SimpleChaincode) upload(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	filename := args[0]
	timestamp := args[1]
	author := args[2]
	hash := args[3]
	mimetype := args[4]
	path := args[5]
	fileoriginalname := args[6]
	version := args[7]

	objectType := "document"
	document := &Document{objectType, filename, timestamp, author, hash, mimetype, path, fileoriginalname, version}
	documentJSONasBytes, err := json.Marshal(document)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(fileoriginalname, documentJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (t *SimpleChaincode) queryDocumentByOwner(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	//author := strings.ToLower(args[0])
	author := "document"
	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"%s\"}}", author)

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	logger.Infof("data is %s", buffer.String())
	return buffer.Bytes(), nil
}

func (t *SimpleChaincode) downloadDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("expecting one argument only")
	}

	Key := args[0]
	queryString := fmt.Sprintf("{\"selector\":{\"_id\":\"%s\"}}", Key)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	logger.Infof("%x", queryResults)
	return shim.Success(queryResults)
}

func (t *SimpleChaincode) getHistoryForDocumnent(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	filename := args[0]
	resultsIterator, err := stub.GetHistoryForKey(filename)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString(string(response.Value))
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	logger.Infof(buffer.String())
	return shim.Success(buffer.Bytes())
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		logger.Errorf("Error starting Simple chaincode: %s", err)
	}
}
