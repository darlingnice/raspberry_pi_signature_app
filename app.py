from flask import Flask,render_template,url_for,request,jsonify
import base64
import requests

app = Flask(__name__)


@app.route('/',methods=["POST","GET"])
def home():
    if request.method == "POST":
        try:
            data :dict = request.get_json()
            signature = data.get('image')
            if signature.startswith("data:image"):
                signature = signature.split(",")[1]  # remove "data:image/png;base64,"
            # decoded_signature = base64.b64decode(signature)
            response = requests.post('http://localhost:5001/signature',json=data)
            if response.ok:
                return "received" , 200
            # with open('image.png','wb') as image_obj:
            #     image_obj.write(decoded_signature)
            return "error occured" , 500
        except Exception as e:
            return f"Internal Server Error {str(e)}" ,500
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)