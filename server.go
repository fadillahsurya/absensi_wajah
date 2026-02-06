
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
)

// UserProfile represents the employee data
type UserProfile struct {
	ID             string  `json:"id"`
	Name           string  `json:"name"`
	Role           string  `json:"role"`
	Department     string  `json:"department"`
	Avatar         string  `json:"avatar"`
	FaceRegistered bool    `json:"faceRegistered"`
	BaseSalary     float64 `json:"baseSalary"`
	Gender         string  `json:"gender"`
	Email          string  `json:"email"`
	Phone          string  `json:"phone"`
}

// Global state for mock database
var (
	userStore = UserProfile{
		ID:             "EMP001",
		Name:           "Budi Santoso",
		Role:           "Senior Developer",
		Department:     "Engineering",
		Avatar:         "https://i.pravatar.cc/150?u=budi",
		FaceRegistered: false,
		BaseSalary:     7500000,
		Gender:         "Laki-laki",
		Email:          "budi.santoso@company.com",
		Phone:          "081234567890",
	}
	mu sync.Mutex
)

// CORS Middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Login Handler
func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	// Simplified mock login
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"token":   "hris-auth-token-xyz-123",
		"user":    userStore,
	})
}

// Profile Handler
func profileHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	switch r.Method {
	case http.MethodGet:
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(userStore)

	case http.MethodPut:
		var updatedUser UserProfile
		if err := json.NewDecoder(r.Body).Decode(&updatedUser); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		userStore = updatedUser
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(userStore)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/login", loginHandler)
	mux.HandleFunc("/api/profile", profileHandler)

	fmt.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(mux)))
}
