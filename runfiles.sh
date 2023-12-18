mate-terminal --tab --title="DRIVER SERVICE TAB" -e "bash -c 'cd ./solution_code/servicesSrc/driver; npm run start'" &
mate-terminal --tab --title="PLATE SERVICE TAB" -e "bash -c 'cd ./solution_code/servicesSrc/plate; npm run start'" &
mate-terminal --tab --title="VEHICLE SERVICE TAB" -e "bash -c 'cd ./solution_code/servicesSrc/vehicle; npm run start'" &
mate-terminal --tab --title="UI TAB" -e "bash -c 'cd ./solution_code/uiSrc; npm run start'"
