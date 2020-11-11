
# remote-slide-changer
A utility for zoom meetings for cases where there are more than one speaker sharing the same slides

## Usage
### client
### host
To use the host script, run it with either:

    python3 remoteSlideChanger.py
    
   or if you want to assign your groupid without the hassle of cli-ui:
    
    python3 remoteSlideChanger.py replace-me-with-your-host-identifier

The script will now receive keypresses from clients connected to the server with the same identifier. To stop execution, use ctrl+c.

## Minimum installation

For minimal installation, only the [host script](/host/remoteSlideChanger.py) has to be downloaded. Python3 and a few dependencies are necessary, install them with:

    pip3 install asyncio websockets keyboard

Then run the script as was defined in the usage section.

## Full installation

### host

Clone the project and install dependencies, use either:

    git clone https://github.com/sainigma/remote-slide-changer.git
    pip3 install asyncio websockets keyboard
    
If you wish to change which keys the host presses on client actions, change the values for **keyboardactions** dict in **/host/remoteSlideChanger.py**. Available keypresses [here.](https://github.com/boppreh/keyboard#API)

Change **uri** in  **/host/remoteSlideChanger.py** to point at the port your server is listening, both ws and wss addresses work.

### server

After cloning the repo, assuming you have npm installed:

    cd server
    npm install

Before running the server, create a .env JSON file at the root of the server and set following variables:

    {
	  "privateKey": "./key.pem",
	  "certificate": "./cert.pem",
	  "port": "1234",
	  "wss": True
    }
Then, run the server with

    npm run start

 ### client
 
At the client folder, create a .env file and add the following entry:

    WSOCK=wss://your-address-here.com:1234
 
 Then build the frontend with:

    cd client
    npm install
    npm run build
    mv /build /path-to-your-server/andfinalfolder

